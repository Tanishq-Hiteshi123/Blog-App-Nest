import {
  Body,
  Controller,
  Get,
  Patch,
  Post,
  Query,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateUserDTO } from './dtos/createUserDTO';
import { UsersService } from './users.service';
import { LoginUserDTO } from './dtos/loginUserDTO';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { Request } from 'express';
import { UpdateProfileDetailsDTO } from './dtos/updateProfileDetailsDTO';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from 'src/file-upload/file-upload.service';
import { ChangePasswordDTO } from './dtos/changePasswordDTO';
import { SendMailDTO } from './dtos/sendMailDTO';
import { SetNewPasswordDTO } from './dtos/setNewPasswordDTO';

@Controller('users')
export class UsersController {
  constructor(
    private readonly userService: UsersService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Post('createNewUser')
  createNewUser(@Body() createUserDTO: CreateUserDTO) {
    return this.userService.createNewUser(createUserDTO);
  }

  @Post('loginUser')
  loginUser(@Body() loginUserDTO: LoginUserDTO) {
    return this.userService.loginUser(loginUserDTO);
  }

  @Get('getMe')
  @UseGuards(AuthGuard)
  getMe(@Req() req: Request) {
    return this.userService.getMe(req);
  }

  @Get('/getAllMyBlogs')
  @UseGuards(AuthGuard)
  getAllMyBlogs(@Req() req: Request) {
    return this.userService.getAllMyPost(req);
  }

  @Patch('updateProfile')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('avatar', {
      storage: FileUploadService.getDiskStorage(),
      limits: { fileSize: 2 * 1024 * 1024 },
    }),
  )
  updateMyProfile(
    @Body() updateProfileDetailsDTO: UpdateProfileDetailsDTO,
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    console.log(updateProfileDetailsDTO, file);
    return this.userService.updateProfileDetails(
      updateProfileDetailsDTO,
      file,
      req,
    );
  }

  @Post('changePassword')
  @UseGuards(AuthGuard)
  changePassword(
    @Body() changePasswordDTO: ChangePasswordDTO,
    @Req() req: Request,
  ) {
    return this.userService.changeUserPassword(changePasswordDTO, req);
  }

  @Post('resetPasswordToken')
  sendResetPasswordToken(@Body() sendMailDTO: SendMailDTO) {
    return this.userService.sendResetPasswordMail(sendMailDTO);
  }

  @Post('setNewPassword')
  setNewPassword(
    @Query('token') token: string,
    @Body() setNewPasswordDTO: SetNewPasswordDTO,
  ) {
    return this.userService.setNewPassword(setNewPasswordDTO, token);
  }
}
