import { IsOptional, IsString } from 'class-validator';

export class CreateBlogDTO {
  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  image?: string;
}
