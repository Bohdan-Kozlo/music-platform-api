import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Track, TrackDocument } from "./schemas/track.schema";
import { CreateTrackDto } from "./dto/create-track.dto";
import { UserService } from "../user/user.service";
import { UpdateUserDto } from "../user/dto/update-user.dto";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { S3Service } from '../s3/s3.service';
import {Comment, CommentDocument} from './schemas/comment.schema';

@Injectable()
export class TrackService {
  constructor(@InjectModel(Track.name) private readonly trackModel: Model<TrackDocument>,
              @InjectModel(Comment.name) private readonly commentModel: Model<CommentDocument>,
              private userService: UserService,
              private s3Service: S3Service,) {
  }

  async getOne(id: string) {
    const track = await this.trackModel.findById(id).populate('comments');
    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
    return track;
  }

  async getAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const tracks = await this.trackModel
      .find()
      .skip(skip)
      .limit(limit)
      .exec();

    const totalTracks = await this.trackModel.countDocuments();

    return {
      tracks,
      total: totalTracks,
      page,
      limit,
      totalPages: Math.ceil(totalTracks / limit),
    };
  }

  async create(track: CreateTrackDto, userId: string, audioFile: Express.Multer.File, imageFile: Express.Multer.File) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }
    const trackUrl = await this.s3Service.uploadAudioFile(audioFile);
    const pictureFileUrl = await this.s3Service.uploadPictureFile(imageFile);
    return this.trackModel.create({...track, listens: 0, user: user, audioName: trackUrl, picture: pictureFileUrl});
  }

  async delete(id: string, userId: string) {
    const deletedTrack = await this.trackModel.deleteOne({ _id: id, user: userId });
    if (!deletedTrack) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
    return deletedTrack;
  }

  async update(id: string, track: UpdateUserDto, userId: string) {
    return this.trackModel.findOneAndUpdate(
      { _id: id, userId: userId },
      { $set: track },
      { new: true },
    );
  }

  async addComment(userId: string, commentDto: CreateCommentDto) {
    const track = await this.trackModel.findById(commentDto.trackId);
    if (!track) {
      throw new NotFoundException(`rack with id ${commentDto.trackId} not found`);
    }
    const user = await this.userService.findById(userId);
    const comment = await this.commentModel.create({...commentDto});
    user.comments.push(comment);
    await user.save();
    track.comments.push(comment);
    return track.save();
  }

  
}
