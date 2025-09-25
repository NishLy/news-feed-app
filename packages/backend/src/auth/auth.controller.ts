import {
  Controller,
  Request,
  Post,
  Body,
  UnauthorizedException,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth.dto.login';
import { CreateUserDTO } from 'src/user/dto/user.dto.create';
import { RefreshTokenDto } from './dto/auth.dto.refresh';

@Controller('api')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() data: AuthLoginDto) {
    const user = await this.authService.validate(data);
    if (!user) throw new UnauthorizedException('Invalid credentials');
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() data: CreateUserDTO) {
    return this.authService.register(data);
  }

  @Post('refreshToken')
  async refresh(@Body() data: RefreshTokenDto) {
    return this.authService.refreshTokens(data.id, data.refreshToken);
  }
}
