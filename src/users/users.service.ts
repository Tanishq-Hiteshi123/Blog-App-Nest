import {
  BadRequestException,
  HttpException,
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
@Injectable()
export class UsersService {
  constructor(
    private readonly dataBaseService: DatabaseService,
    private jwtService: JwtService,
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

  generateAccessToken(userId: number, fullName: string, email: string): string {
    const accessToken = this.jwtService.sign({ userId, fullName, email });
    return accessToken;
  }
}
