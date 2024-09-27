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
import { AlbumService } from './album.service';
import { AccessTokenGuard } from '../common/guards/accessToken.guard';
import { CreateAlbumDto } from './dto/create-album.dto';
import { GetUser } from '../common/decorators/getUser.decorator';
import { JwtPayload } from '../auth/strategies/access-token.strategy';
import { imageFileUploadInterceptor } from './interceptors/file-upload.interceptor';

@Controller('albums')
export class AlbumController {
  constructor(private readonly albumService: AlbumService) {}

  @UseGuards(AccessTokenGuard)
  @Post()
  @UseInterceptors(imageFileUploadInterceptor())
  async createAlbum(
    @Body() createAlbumDto: CreateAlbumDto,
    @GetUser() user: JwtPayload,
    @UploadedFiles() files: { image?: Express.Multer.File[] },
  ) {
    const imageFile = files?.image ? files.image[0] : null;
    return this.albumService.create(createAlbumDto, user.userId, imageFile);
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
