import { Injectable } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from "./user.schema";

@Injectable()
export class UserService {
  constructor(private userRepository: UserRepository) {}

  async findById(userId: string)  {
    return this.userRepository.findOne({_id : userId });
  }

  findByEmail(email: string) {
    return this.userRepository.findOne({ email });
  }

  create(user: CreateUserDto) {
    return this.userRepository.create(user);
  }

  update(user: UpdateUserDto, userId: string) {
    return this.userRepository.findOneAndUpdate({ _id: userId }, user);
  }

  updateRefreshToken(userId: string, refreshToken: string) {
    return this.userRepository.updateRefreshToken(userId, refreshToken);
  }

  delete(userId: string) {
    return this.userRepository.deleteMany({ _id: userId });
  }
}
