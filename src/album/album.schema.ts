import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { HydratedDocument } from 'mongoose';
import * as mongoose from 'mongoose';
import { User } from '../user/user.schema';
import { Track } from '../track/schemas/track.schema';

export type AlbumDocument = HydratedDocument<Album>;

@Schema()
export class Album {
  @Prop()
  name: string;

  @Prop()
  picture: string;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'User' })
  author: User;

  @Prop({ type: mongoose.Types.ObjectId, ref: 'Track' })
  tracks: Track[];
}

export const AlbumSchema = SchemaFactory.createForClass(Album);
