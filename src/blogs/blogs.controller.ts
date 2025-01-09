import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CreateBlogDTO } from './dtos/createBlogDTO';
import { BlogsService } from './blogs.service';
import { Request } from 'express';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { FileInterceptor } from '@nestjs/platform-express';
import { FileUploadService } from 'src/file-upload/file-upload.service';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly fileUploadService: FileUploadService,
  ) {}

  @Post('createBlog')
  @UseGuards(AuthGuard)
  @UseInterceptors(
    FileInterceptor('blogImage', {
      storage: FileUploadService.getDiskStorage(),
      limits: { fileSize: 1024 * 1024 * 2 },
    }),
  )
  createNewBlog(
    @Body() createBlogDTO: CreateBlogDTO,
    @Req() req: Request,
    @UploadedFile() file: Express.Multer.File,
  ) {
    return this.blogsService.createNewBlog(createBlogDTO, req, file);
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  getBlogById(@Param('id') id: number) {
    return this.blogsService.getBlogById(+id);
  }
}
