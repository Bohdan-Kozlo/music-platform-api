import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from '@nestjs/common';
import { AlbumService } from './album.service';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { CreateAlbumDto } from './dto/create-album.dto';
import { GetUser } from '../common/decorators/getUser.decorator';
import { JwtPayload } from '../auth/strategies/access-token.strategy';

@Controller('albums')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  async createAlbum(
    @Body() createAlbumDto: CreateAlbumDto,
    @GetUser() user: JwtPayload,
  ) {
    return this.albumService.create(createAlbumDto, user.userId);
  }

  @Get(':id')
  async getAlbumById(@Param('id') id: string) {
    return this.albumService.getAlbumById(id);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':id')
  async deleteAlbum(@Param('id') id: string) {
    return this.albumService.getAlbumById(id);
  }

  @UseGuards(AccessTokenGuard)
  @Get()
  async getAllAlbums(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.albumService.getAllAlbums(page, limit);
  }
}
