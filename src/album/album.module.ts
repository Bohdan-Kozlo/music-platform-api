import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Album, AlbumSchema } from './album.schema';
import { AlbumService } from './album.service';
import { AlbumController } from './album.controller';
import { UserModule } from '../user/user.module';
import { TrackModule } from '../track/track.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Album.name, schema: AlbumSchema }]),
    UserModule,
    TrackModule,
  ],
  providers: [AlbumService],
  controllers: [AlbumController],
})
export class AlbumModule {}
