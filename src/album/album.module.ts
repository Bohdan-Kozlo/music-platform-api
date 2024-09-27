import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Album, AlbumSchema } from './album.schema';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { UserModule } from '../user/user.module';
import { TrackModule } from '../track/track.module';
import { S3Module } from '../s3/s3.module';
import { AlbumRepository } from './album.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Album.name, schema: AlbumSchema }]),
    UserModule,
    TrackModule,
    S3Module,
  ],
  providers: [AlbumService, AlbumRepository],
  controllers: [AlbumController],
})
export class AlbumModule {}
