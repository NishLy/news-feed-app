import {
  Controller,
  Request,
  Post,
  UseGuards,
  Get,
  Body,
  NotFoundException,
} from '@nestjs/common';

import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth.dto.login';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() data: AuthLoginDto) {
    const user = await this.authService.validate(data);
    if (!user) throw new NotFoundException();
    return this.authService.login(user);
  }
}
