import {
  IsArray,
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsString()
  @IsNotEmpty()
  userName: string;

  @IsEmail()
  email: string;

  @MinLength(8)
  @IsString()
  password: string;

  @IsArray()
  @IsOptional()
  MyBlogs: [];
}
