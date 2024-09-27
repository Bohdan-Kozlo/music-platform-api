import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { GetObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';
import { v4 as uuidv4 } from 'uuid';



@Injectable()
export class S3Service {
  private s3Client: S3Client;
  private readonly bucketName: string;

  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: configService.get<string>('AWS_REGION'),
      credentials: {
        accessKeyId: this.configService.get('AWS_ACCESS_KEY_ID'),
        secretAccessKey: this.configService.get('AWS_SECRET_ACCESS_KEY'),
      },
    });
    this.bucketName = configService.get<string>('AWS_BUCKET_NAME');
  }

  async uploadAudioFile(file: Express.Multer.File): Promise<string> {

    const trackName = `audios/${file.filename}-${uuidv4()}`;

    const uploadParams = {
      Bucket: this.bucketName,
      Key: trackName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(uploadParams);

    try {
      await this.s3Client.send(command);
      return `https://${this.bucketName}.s3.amazonaws.com/${trackName}`;
    } catch (e) {
      throw new HttpException('File upload failed', HttpStatus.BAD_REQUEST);
    }
  }

  async downloadAudioFile(fileName: string): Promise<Readable> {
    const downloadParams = {
      Bucket: this.bucketName,
      Key: fileName,
    };

    const command = new GetObjectCommand(downloadParams);

    try {
      const response = await this.s3Client.send(command);
      return response.Body as Readable;
    } catch (e) {
      throw new HttpException('File download failed', HttpStatus.BAD_REQUEST);
    }
  }

  async uploadPictureFile(file: Express.Multer.File): Promise<string> {
    if (!file.mimetype.startsWith('image/')) {
      throw new HttpException('Only image files are allowed', HttpStatus.BAD_REQUEST);
    }

    const imageFileName = `${uuidv4()}-${file.originalname}`;

    const uploadParams = {
      Bucket: this.bucketName,
      Key: imageFileName,
      Body: file.buffer,
      ContentType: file.mimetype,
    };

    const command = new PutObjectCommand(uploadParams);

    try {
      await this.s3Client.send(command);
      return `https://${this.bucketName}.s3.amazonaws.com/${imageFileName}`;
    } catch (e) {
      throw new HttpException('Image upload failed', HttpStatus.BAD_REQUEST);
    }
  }

  async downloadPictureFile(fileName: string): Promise<Readable> {
    const downloadParams = {
      Bucket: this.bucketName,
      Key: fileName,
    };

    const command = new GetObjectCommand(downloadParams);

    try {
      const response = await this.s3Client.send(command);
      const stream = response.Body as Readable;

      if (!stream) {
        throw new HttpException('Image not found', HttpStatus.NOT_FOUND);
      }

      return stream;
    } catch (e) {
      throw new HttpException('Image download failed', HttpStatus.BAD_REQUEST);
    }
  }


}
