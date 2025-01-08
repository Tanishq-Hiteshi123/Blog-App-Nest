import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CreateBlogDTO } from './dtos/createBlogDTO';
import { BlogsService } from './blogs.service';
import { Request } from 'express';
import { AuthGuard } from 'src/common/guard/auth.guard';

@Controller('blogs')
export class BlogsController {
  constructor(private readonly blogsService: BlogsService) {}

  @Post('createBlog')
  @UseGuards(AuthGuard)
  createNewBlog(@Body() createBlogDTO: CreateBlogDTO, @Req() req: Request) {
    return this.blogsService.createNewBlog(createBlogDTO, req);
  }

  @Get('/:id')
  @UseGuards(AuthGuard)
  getBlogById(@Param('id') id: number) {
    return this.blogsService.getBlogById(+id);
  }
}
