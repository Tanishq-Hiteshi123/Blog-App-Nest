import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { BlogsModule } from './blogs/blogs.module';
import { FileUploadModule } from './file-upload/file-upload.module';

@Module({
  imports: [DatabaseModule, UsersModule, BlogsModule, FileUploadModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
