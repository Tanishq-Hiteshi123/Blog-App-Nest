import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { DatabaseModule } from 'src/database/database.module';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from 'src/common/interceptors/responseInterceptors';
import { JwtModule } from '@nestjs/jwt';
@Module({
  imports: [
    DatabaseModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: {
        expiresIn: '2d',
      },
    }),
  ],
  controllers: [UsersController],
  providers: [
    UsersService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class UsersModule {}
