import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Album, AlbumDocument } from './album.schema';
import { EntityRepository } from '../common/database/entity.repository';

@Injectable()
export class AlbumRepository extends EntityRepository<AlbumDocument> {
  constructor(@InjectModel(Album.name) private albumModel: Model<AlbumDocument>) {
    super(albumModel);
  }

  async findWithPagination(page: number, limit: number): Promise<AlbumDocument[]> {
    return this.albumModel.find().skip((page - 1) * limit).limit(limit).exec();
  }

}
