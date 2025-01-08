import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './database/database.module';
import { UsersModule } from './users/users.module';
import { BlogsModule } from './blogs/blogs.module';

@Module({
  imports: [DatabaseModule, UsersModule, BlogsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
