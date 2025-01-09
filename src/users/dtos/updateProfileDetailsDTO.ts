import { IsOptional, IsString } from 'class-validator';

export class UpdateProfileDetailsDTO {
  @IsString()
  @IsOptional()
  fullName: string;

  @IsString()
  @IsOptional()
  userName: string;

  @IsString()
  @IsOptional()
  password: string;

  @IsString()
  @IsOptional()
  avatar: string;
}
