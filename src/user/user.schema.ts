import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { Track } from '../track/schemas/track.schema';
import * as mongoose from 'mongoose';
import { Album } from '../album/album.schema';
import { Comment} from "../track/schemas/comment.schema";

export type UserDocument = HydratedDocument<User>;

@Schema()
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop()
  password: string;

  @Prop()
  refreshToken: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Track' })
  track: Track[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' })
  comments: Comment[];

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Album' })
  album: Album[];
}
export const UserSchema = SchemaFactory.createForClass(User);
