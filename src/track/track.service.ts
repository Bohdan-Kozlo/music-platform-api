import { Injectable, NotFoundException } from "@nestjs/common";
import { CreateTrackDto } from "./dto/create-track.dto";
import { UpdateUserDto } from "../user/dto/update-user.dto";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { S3Service } from '../s3/s3.service';
import { UserService } from "../user/user.service";
import { TrackRepository } from "./repositories/track.repository";
import { CommentRepository } from "./repositories/comment.repository";

@Injectable()
export class TrackService {
  constructor(
    private readonly trackRepository: TrackRepository,
    private readonly commentRepository: CommentRepository,
    private readonly userService: UserService,
    private readonly s3Service: S3Service,
  ) {}

  async getOne(id: string) {
    const track = await this.trackRepository.findOne({ _id: id }, { populate: 'comments' });
    if (!track) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
    return track;
  }

  async getAll(page: number = 1, limit: number = 10) {
    const skip = (page - 1) * limit;

    const tracks = await this.trackRepository.find({}, { skip, limit });
    const totalTracks = await this.trackRepository.countDocuments();

    return {
      tracks,
      total: totalTracks,
      page,
      limit,
      totalPages: Math.ceil(totalTracks / limit),
    };
  }

  async create(trackData: CreateTrackDto, userId: string, audioFile: Express.Multer.File, imageFile: Express.Multer.File) {
    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    const trackUrl = await this.s3Service.uploadAudioFile(audioFile);
    const pictureFileUrl = await this.s3Service.uploadPictureFile(imageFile);

    return this.trackRepository.create({
      ...trackData,
      listens: 0,
      user: user._id,
      audioName: trackUrl,
      picture: pictureFileUrl,
    });
  }

  async delete(id: string, userId: string) {
    const deletedTrack = await this.trackRepository.deleteMany({ _id: id, user: userId });
    if (!deletedTrack) {
      throw new NotFoundException(`Track with id ${id} not found`);
    }
    return deletedTrack;
  }

  async update(id: string, track: UpdateUserDto, userId: string) {
    return this.trackRepository.findOneAndUpdate(
      { _id: id, userId: userId },
      { $set: track },
    );
  }

  async addComment(userId: string, commentDto: CreateCommentDto) {
    const track = await this.trackRepository.findOne({ _id: commentDto.trackId });
    if (!track) {
      throw new NotFoundException(`Track with id ${commentDto.trackId} not found`);
    }

    const user = await this.userService.findById(userId);
    const comment = await this.commentRepository.create({ ...commentDto });

    user.comments.push(comment);
    await user.save();

    track.comments.push(comment);
    return track.save();
  }
}
