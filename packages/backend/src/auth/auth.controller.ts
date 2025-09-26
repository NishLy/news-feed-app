import {
  Controller,
  Request,
  Post,
  Body,
  UnauthorizedException,
  HttpCode,
  Res,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth.dto.login';
import { CreateUserDTO } from 'src/user/dto/user.dto.create';
import { RefreshTokenDto } from './dto/auth.dto.refresh';
import { Response } from 'express';

@Controller('api')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() data: AuthLoginDto, @Res() res: Response) {
    const user = await this.authService.validate(data);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const tokens = await this.authService.login(user);
    res.cookie('refresh_token', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    res.cookie('user_id', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
    });
    return res.json({ token: tokens.token });
  }

  @Post('register')
  async register(@Body() data: CreateUserDTO) {
    return this.authService.register(data);
  }

  @Post('refreshToken')
  @HttpCode(200)
  async refresh(@Body() data: RefreshTokenDto) {
    return this.authService.refreshTokens(data.id, data.refreshToken);
  }
}
