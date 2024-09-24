import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user/user.service';
import { ConfigService } from '@nestjs/config';
import { CreateUserDto } from '../user/dto/create-user.dto';
import * as argon2 from 'argon2';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userService: UserService,
    private configService: ConfigService,
  ) {}

  async signUp(createUserDto: CreateUserDto, isGoogleAuthorization = false) {
    const userExists = await this.userService.findByEmail(createUserDto.email);
    if (userExists) {
      throw new BadRequestException('User already exists');
    }
    let hashPassword = null;
    if (!isGoogleAuthorization) {
      hashPassword = await argon2.hash(createUserDto.password);
    }
    const newUser = await this.userService.create({
      ...createUserDto,
      password: hashPassword,
    });
    const tokens = await this.getTokens(newUser._id.toString(), newUser.name);
    newUser.refreshToken = tokens.refreshToken;
    await this.userService.update(newUser, newUser._id.toString());

    return tokens;
  }

  async signIn(authDto: LoginDto) {
    const user = await this.userService.findByEmail(authDto.email);
    if (!user) {
      throw new BadRequestException('User already exists');
    }

    const passwordMatches = await argon2.verify(
      user.password,
      authDto.password,
    );
    if (!passwordMatches) {
      throw new BadRequestException('Password is incorrect');
    }
    const tokens = await this.getTokens(user.name, user._id.toString());
    user.refreshToken = tokens.refreshToken;
    await this.userService.update(user, user._id.toString());

    return tokens;
  }

  async getTokens(username: string, userId: string) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          username,
          userId,
        },
        {
          secret: this.configService.getOrThrow('JWT_ACCESS_SECRET'),
          expiresIn: '15m',
        },
      ),
      this.jwtService.signAsync(
        {
          username,
          userId,
        },
        {
          secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
          expiresIn: '7d',
        },
      ),
    ]);

    return { accessToken, refreshToken };
  }

  async logout(userId: string) {
    return this.userService.updateRefreshToken(userId, null);
  }

  async signInWithGoogle(user) {
    const existingUser = await this.userService.findByEmail(user.email);
    if (!existingUser) {
      return this.signUp(user, true);
    }

    return this.getTokens(existingUser.name, existingUser._id.toString());
  }
}
