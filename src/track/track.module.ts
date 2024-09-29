import { Module } from '@nestjs/common';
import { TrackService } from './track.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Track, TrackSchema } from './schemas/track.schema';
import { CommentSchema, Comment } from './schemas/comment.schema';
import { TrackController } from './track.controller';
import { UserModule } from "../user/user.module";
import { S3Module } from '../s3/s3.module';
import { TrackRepository } from './repositories/track.repository';
import { CommentRepository } from './repositories/comment.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Track.name, schema: TrackSchema },
      { name: Comment.name, schema: CommentSchema },
    ]),
    UserModule,
    S3Module,
  ],
  providers: [TrackService, TrackRepository, CommentRepository],
  controllers: [TrackController],
  exports: [TrackService],
})
export class TrackModule {}
