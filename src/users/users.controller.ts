import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { CreateUserDTO } from './dtos/createUserDTO';
import { UsersService } from './users.service';
import { LoginUserDTO } from './dtos/loginUserDTO';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

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
}
