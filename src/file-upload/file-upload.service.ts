import { Injectable } from '@nestjs/common';
import { diskStorage } from 'multer';
import * as path from 'path';
@Injectable()
export class FileUploadService {
  private static readonly uploadPath = './uploads';

  //   Generate the unique name for the uploaded file :-
  private static generateFileName(file: Express.Multer.File): string {
    console.log(file, 'here');
    const extName = path.extname(file?.originalname);

    return `${file.fieldname}-${Date.now()}${extName}`;
  }

  //   Multer Configuration :-

  static getDiskStorage() {
    return diskStorage({
      destination: FileUploadService.uploadPath,
      filename(req, file, callback) {
        const generatedName = FileUploadService.generateFileName(file);
        console.log('Generate Name ', generatedName);
        callback(null, generatedName);
      },
    });
  }
}
