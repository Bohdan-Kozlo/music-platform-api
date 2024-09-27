import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { TrackService } from "./track.service";
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetUser } from '../common/decorators/getUser.decorator';
import { JwtPayload } from '../auth/strategies/access-token.strategy';
import { CreateTrackDto } from './dto/create-track.dto';
import { fileValidationInterceptor } from './interceptors/fileValidationInterceptor';

@Controller('tracks')
export class TrackController {
  constructor(private trackService: TrackService) {}

  @UseGuards(AccessTokenGuard)
  @Post('comment')
  async addComment(@Body() createCommentDto: CreateCommentDto, @GetUser() user: JwtPayload) {
    return this.trackService.addComment(user.userId, createCommentDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get(':id')
  async getTrackById(@Param('id') id: string) {
    return this.trackService.getOne(id);
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  async getAllTracks(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.trackService.getAll(page, limit);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  async deleteTrack(@Param('id') id: string, @GetUser() user: JwtPayload) {
    return this.trackService.delete(id, user.userId);
  }

  @UseGuards(AccessTokenGuard)
  @Post('')
  @UseInterceptors(fileValidationInterceptor())
  async createTrack(
    @UploadedFiles() files: { audio?: Express.Multer.File[]; image?: Express.Multer.File[] },
    @Body() trackData: CreateTrackDto,
    @GetUser() user: JwtPayload,
  ) {
    const audioFile = files.audio?.[0];
    const imageFile = files.image?.[0];

    return this.trackService.create(trackData, user.userId, audioFile, imageFile);
  }

}
