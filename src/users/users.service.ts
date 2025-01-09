import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  Req,
  UnauthorizedException,
} from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { CreateUserDTO } from './dtos/createUserDTO';
import { hashPassword } from 'src/utils/hashUserPassword';
import { LoginUserDTO } from './dtos/loginUserDTO';
import { comparePassword } from 'src/utils/comparePassword';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { UpdateProfileDetailsDTO } from './dtos/updateProfileDetailsDTO';
import { ChangePasswordDTO } from './dtos/changePasswordDTO';
import { SendMailDTO } from './dtos/sendMailDTO';
import { MailService } from 'src/common/services/mail.service';
import { v4 as uuidV4 } from 'uuid';
import { SetNewPasswordDTO } from './dtos/setNewPasswordDTO';
@Injectable()
export class UsersService {
  constructor(
    private readonly dataBaseService: DatabaseService,
    private jwtService: JwtService,
    private mailService: MailService,
  ) {}

  async createNewUser(createUserDTO: CreateUserDTO) {
    try {
      const { fullName, email, password, userName } = createUserDTO;

      if (!fullName || !email || !password || !userName) {
        throw new BadRequestException('Please Provide all the details');
      }

      const isUserExist = await this.dataBaseService.user.findFirst({
        where: {
          email,
        },
      });

      if (isUserExist) {
        throw new BadRequestException('User Already Exist');
      }

      const hashedPassword = await hashPassword(password);

      const newUser = await this.dataBaseService.user.create({
        data: { ...createUserDTO, password: hashedPassword },
      });

      if (!newUser) {
        throw new InternalServerErrorException('User Already Exist');
      }

      return newUser;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async loginUser(loginUserDTO: LoginUserDTO) {
    try {
      const { email, password } = loginUserDTO;

      if (!email || !password) {
        throw new BadRequestException('Please Provide all the details');
      }

      const isUserExist = await this.dataBaseService.user.findFirst({
        where: {
          email,
        },
      });

      if (!isUserExist) {
        throw new BadRequestException('User does not Exist');
      }

      const isMatch = await comparePassword(password, isUserExist.password);

      if (!isMatch) {
        throw new HttpException('Invalid Credentails', 402);
      }

      //   Going to generate the JWT :-

      const token = this.generateAccessToken(
        isUserExist.id,
        isUserExist.fullName,
        isUserExist.email,
      );

      console.log(token);

      return token;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  //   Creating an API for getting the Profile :-
  async getMe(@Req() req: Request) {
    try {
      console.log('object');
      const userId = req?.user?.userId;

      const userDetails = await this.dataBaseService.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!userDetails) {
        throw new NotFoundException('User Not found');
      }

      return userDetails;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getAllMyPost(@Req() req: Request) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        throw new UnauthorizedException('User ID is not Provided');
      }

      const allMyPost = await this.dataBaseService.blog.findMany({
        where: {
          userId,
        },
      });

      return allMyPost;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  public async updateProfileDetails(
    updateProfileDetailsDTO: UpdateProfileDetailsDTO,
    file: Express.Multer.File,
    req: Request,
  ) {
    try {
      const { fullName, password, userName } = updateProfileDetailsDTO;

      console.log(fullName, password, userName, file);
      const userId = req.user?.userId;

      if (!userId) {
        throw new UnauthorizedException('User Id is not Provided');
      }
      const userDetails = await this.dataBaseService.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!userDetails) {
        throw new NotFoundException('User Not Found');
      }
      // Update User :-
      const updateData = {
        fullName: fullName || userDetails?.fullName,
        password: password || userDetails?.password,
        userName: userName || userDetails?.userName,
        avatar: file ? file?.path : null,
      };

      console.log('My Updated Data ', updateData);

      const updatedUserDetails = await this.dataBaseService.user.update({
        where: {
          id: userId,
        },
        data: { ...updateData },
      });

      if (!updatedUserDetails) {
        throw new HttpException(
          'User Details could not get updated',
          HttpStatus.EXPECTATION_FAILED,
        );
      }

      return updatedUserDetails;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async changeUserPassword(changePasswordDTO: ChangePasswordDTO, req: Request) {
    try {
      const { oldPassword, newPassword } = changePasswordDTO;

      if (!oldPassword || !newPassword) {
        throw new BadRequestException('Both the passwords are required');
      }

      //  Find the user By id :-
      const userId = req?.user?.userId;

      const userDetails = await this.dataBaseService.user.findFirst({
        where: {
          id: userId,
        },
      });

      if (!userDetails) {
        throw new NotFoundException('User Details not found');
      }

      // Compare the passwords :-
      const isMatch = await comparePassword(oldPassword, userDetails.password);

      if (!isMatch) {
        throw new UnauthorizedException('Invalid Credentails');
      }

      // Now hash the new Password and save it into the DB :-
      const newHashedPassword = await hashPassword(newPassword);

      const updatedUserWithPassword = await this.dataBaseService.user.update({
        where: {
          id: userId,
        },
        data: {
          password: newHashedPassword,
        },
      });

      if (!updatedUserWithPassword) {
        return {
          message: 'Password Updated SuccessFully',
        };
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async sendResetPasswordMail(sendMailDTO: SendMailDTO) {
    try {
      const { email } = sendMailDTO;

      if (!email) {
        throw new BadRequestException('Please Provide the mail Address');
      }

      const userDetails = await this.dataBaseService.user.findFirst({
        where: {
          email,
        },
      });

      if (userDetails) {
        const expiryDate = new Date();

        expiryDate.setHours(expiryDate.getHours() + 1);
        // Generate the Unique Token :-
        const token = uuidV4();

        // Send Mail :-
        await this.mailService.sendPasswordResetEmail(email, token);

        // Store the entry into the DB :-
        const userResetToken = await this.dataBaseService.resetPassword.create({
          data: {
            token,
            userId: userDetails.id,
            expiry: expiryDate,
          },
        });

        if (!userResetToken) {
          throw new HttpException(
            'Reset Token can not be stored in DB',
            HttpStatus.INTERNAL_SERVER_ERROR,
          );
        }

        return 'Mail Send SuccessFully';
      }
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async setNewPassword(setNewPasswordDTO: SetNewPasswordDTO, token: string) {
    try {
      const { newPassword } = setNewPasswordDTO;

      if (!newPassword || !token) {
        throw new BadRequestException(
          'New Password Field and Token both  are required',
        );
      }

      const tokenDetails = await this.dataBaseService.resetPassword.findFirst({
        where: {
          token: token,
        },
      });

      if (!tokenDetails) {
        throw new BadRequestException('Invalid Token Link');
      }

      const userDetails = await this.dataBaseService.user.findFirst({
        where: {
          id: tokenDetails.userId,
        },
      });
      await this.dataBaseService.resetPassword.delete({
        where: {
          id: tokenDetails.id,
        },
      });

      // Now Update the Password :-
      const hashedPassword = await hashPassword(newPassword);

      const updatedUserDetails = await this.dataBaseService.user.update({
        data: {
          password: hashedPassword,
        },
        where: {
          id: userDetails.id,
        },
      });

      if (!updatedUserDetails) {
        throw new InternalServerErrorException('User Password could not set');
      }

      return {
        message: 'Password updated SuccessFully',
        updatedUserDetails,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
  generateAccessToken(userId: number, fullName: string, email: string): string {
    const accessToken = this.jwtService.sign({ userId, fullName, email });
    return accessToken;
  }
}
