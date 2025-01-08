import {
  Injectable,
  InternalServerErrorException,
  OnModuleDestroy,
  OnModuleInit,
} from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class DatabaseService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('Database Connected SuccessFully');
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async onModuleDestroy() {
    try {
      await this.$disconnect();
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
