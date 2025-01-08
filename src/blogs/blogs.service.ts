import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateBlogDTO } from './dtos/createBlogDTO';
import { DatabaseService } from 'src/database/database.service';
import { Request } from 'express';

@Injectable()
export class BlogsService {
  constructor(private dataBaseService: DatabaseService) {}
  async createNewBlog(createBlogDTO: CreateBlogDTO, req: Request) {
    try {
      const { title, description } = createBlogDTO;
      const userId = req.user?.userId;

      if (!title) {
        throw new BadRequestException('Title is required');
      }

      if (!userId) {
        throw new BadRequestException('User not authenticated Okay');
      }
      const newBlog = await this.dataBaseService.blog.create({
        data: {
          title: title,
          decription: description || '',
          userId: userId,
        },
      });

      if (!newBlog) {
        throw new BadRequestException('Blog could not be created');
      }

      return newBlog;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async getBlogById(id: number) {
    try {
      if (!id) {
        throw new NotFoundException('Id for Blog is not provided');
      }

      const blogDetails = await this.dataBaseService.blog.findFirst({
        where: {
          id: id,
        },
      });

      if (!blogDetails) {
        throw new NotFoundException('Blog with required ID not found');
      }

      return blogDetails;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
