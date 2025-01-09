import { IsString, MinLength } from 'class-validator';

export class SetNewPasswordDTO {
  @IsString()
  @MinLength(8)
  newPassword: string;
}
