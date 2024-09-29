import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EntityRepository } from '../../common/database/entity.repository';
import { Track, TrackDocument } from '../schemas/track.schema';

@Injectable()
export class TrackRepository extends EntityRepository<TrackDocument> {
  constructor(@InjectModel(Track.name) trackModel: Model<TrackDocument>) {
    super(trackModel);
  }
}