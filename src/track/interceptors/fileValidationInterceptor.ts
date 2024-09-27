import { BadRequestException } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

export const fileValidationInterceptor = () =>
  FileFieldsInterceptor(
    [
      { name: 'audio', maxCount: 1 },
      { name: 'image', maxCount: 1 },
    ],
    {
      limits: {
        fileSize: 50 * 1024 * 1024,
      },
      fileFilter: (req, file, callback) => {
        if (file.fieldname === 'audio') {
          if (!file.mimetype.match(/\/(mp3|mpeg|wav)$/)) {
            return callback(
              new BadRequestException('Only audio files in MP3, MPEG or WAV formats are allowed'),
              false,
            );
          }
        }

        if (file.fieldname === 'image') {
          if (!file.mimetype.match(/\/(jpg|jpeg|png|gif)$/)) {
            return callback(
              new BadRequestException('Only images in JPG, JPEG, PNG or GIF formats are allowed'),
              false,
            );
          }
        }
        callback(null, true);
      },
    },
  );
