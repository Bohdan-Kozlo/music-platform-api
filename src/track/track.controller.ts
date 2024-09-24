import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { TrackService } from "./track.service";
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { CreateCommentDto } from './dto/create-comment.dto';
import { GetUser } from '../common/decorators/getUser.decorator';
import { JwtPayload } from '../auth/strategies/access-token.strategy';

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




}
