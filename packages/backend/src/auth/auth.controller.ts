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
import { ApiResponse } from '@nestjs/swagger';

@Controller('api')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiResponse({
    status: 200,
    description: 'To login user',
    example: { token: 'exmpletoken' },
  })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
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

  @ApiResponse({
    status: 201,
    description: 'To register new user',
    example: {
      id: 3,
      username: 'admin12223',
      passwordHash:
        '$2b$10$4Q4Ztx4FH6rxd.ovxHOaROHsXHuoKq1XEarYmoqPzpSIu1Incpzf2',
      refreshToken: null,
      createdAt: '2025-09-27T05:19:04.656Z',
    },
  })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  @ApiResponse({
    status: 409,
    description: 'Conflict',
    example: {
      statusCode: 409,
      message: 'Username already exists',
      error: 'ConflictException',
      timestamp: '2025-09-27T05:17:08.841Z',
      path: '/api/register',
    },
  })
  @Post('register')
  async register(@Body() data: CreateUserDTO) {
    return this.authService.register(data);
  }

  @ApiResponse({
    status: 200,
    description: 'To refresh token',
    example: { token: 'exmpletoken' },
  })
  @ApiResponse({ status: 401, description: 'Invalid credentials.' })
  @Post('refreshToken')
  @HttpCode(200)
  async refresh(@Body() data: RefreshTokenDto) {
    return this.authService.refreshTokens(data.id, data.refreshToken);
  }
}
