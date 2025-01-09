import { Module } from '@nestjs/common';
import { FileUploadService } from './file-upload.service';

@Module({
  controllers: [],
  providers: [FileUploadService],
})
export class FileUploadModule {}
