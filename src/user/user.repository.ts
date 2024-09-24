import { EntityRepository } from '../common/database/entity.repository';
import { User, UserDocument } from './user.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';

@Injectable()
export class UserRepository extends EntityRepository<UserDocument> {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {
    super(userModel);
  }

  async updateRefreshToken(userId: string, refreshToken: string) {
    return this.userModel.updateOne(
      { _id: userId },
      { $set: { refreshToken } },
    );
  }
}
