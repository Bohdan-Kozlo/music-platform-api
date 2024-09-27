import { BadRequestException } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

export function imageFileUploadInterceptor() {
  return FileFieldsInterceptor(
    [
      { name: 'image', maxCount: 1 },
    ],
    {
      limits: {
        fileSize: 10 * 1024 * 1024,
      },
      fileFilter: (req, file, callback) => {
        if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
          return callback(
            new BadRequestException('Only images in JPG, JPEG, PNG or GIF formats are allowed'),
            false,
          );
        }
        callback(null, true);
      },
    },
  );
}