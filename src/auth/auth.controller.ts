import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';
import { Request } from 'express';
import { GoogleOauthGuard } from '../common/guards/google-oauth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto) {
    return this.authService.signUp(createUserDto);
  }

  @Post('signin')
  async signin(@Body() authDto: LoginDto) {
    return this.authService.signIn(authDto);
  }

  @Get('logout')
  async logout(@Req() req: Request) {
    await this.authService.logout(req.user['userId']);
  }

  @Get('google')
  @UseGuards(GoogleOauthGuard)
  async auth() {}

  @Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleCallback(@Req() req: Request) {
    return this.authService.signInWithGoogle(req.user);
  }
}
