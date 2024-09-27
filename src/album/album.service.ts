import { Injectable, NotFoundException } from '@nestjs/common';
import { AlbumRepository } from './album.repository';
import { TrackService } from '../track/track.service';
import { UserService } from '../user/user.service';
import { CreateAlbumDto } from './dto/create-album.dto';
import { Album, AlbumDocument } from './album.schema';
import { S3Service } from '../s3/s3.service';

@Injectable()
export class AlbumService {
  constructor(
    private readonly albumRepository: AlbumRepository,
    private readonly trackService: TrackService,
    private readonly userService: UserService,
    private readonly s3Service: S3Service,
  ) {}

  async create(createAlbumDto: CreateAlbumDto, userId: string, imageFile: Express.Multer.File): Promise<Album> {
    let imageUrl = null;

    if (imageFile) {
      imageUrl = await this.s3Service.uploadPictureFile(imageFile);
    }

    const user = await this.userService.findById(userId);
    if (!user) {
      throw new NotFoundException(`User with id ${userId} not found`);
    }

    return await this.albumRepository.create({
      ...createAlbumDto,
      author: user._id,
      picture: imageUrl,
    });
  }

  async getAlbumById(albumId: string): Promise<AlbumDocument> {
    const album = await this.albumRepository.findOne({ _id: albumId });
    if (!album) {
      throw new NotFoundException(`Album with id ${albumId} not found`);
    }
    return album;
  }

  async getAllAlbums(page: number = 1, limit: number = 10) {
    const albums = this.albumRepository.findWithPagination(page, limit);

    const totalAlbums = await this.albumRepository.entityModel.countDocuments();

    return {
      albums,
      total: totalAlbums,
      page,
      limit,
      totalPages: Math.ceil(totalAlbums / limit),
    };
  }

  async addTrackToAlbum(albumId: string, trackId: string) {
    const album = await this.getAlbumById(albumId);
    const track = await this.trackService.getOne(trackId);

    if (!track) {
      throw new NotFoundException(`Track with id ${trackId} not found`);
    }

    album.tracks.push(track);
    await album.save();
    return album;
  }

  async deleteAlbum(albumId: string, userId: string): Promise<void> {
    const album = await this.getAlbumById(albumId);
    if (album.author.toString() !== userId) {
      throw new NotFoundException(`You do not have permission to delete this album`);
    }

    await this.albumRepository.deleteMany({ _id: albumId });
  }
}
