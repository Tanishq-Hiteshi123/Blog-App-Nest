import { IsString } from 'class-validator';

export class SendMailDTO {
  @IsString()
  email: string;
}
