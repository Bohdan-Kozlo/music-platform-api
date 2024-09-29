import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Comment, CommentDocument } from '../schemas/comment.schema';
import { EntityRepository } from '../../common/database/entity.repository';

@Injectable()
export class CommentRepository extends EntityRepository<CommentDocument> {
  constructor(@InjectModel(Comment.name) commentModel: Model<CommentDocument>) {
    super(commentModel);
  }
}
