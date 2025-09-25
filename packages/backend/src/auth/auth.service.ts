import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthLoginDto } from './dto/auth.dto.login';
import { User } from 'src/user/user.entity';
import { AuthPayload } from './types/jwt';
import { CreateUserDTO } from 'src/user/dto/user.dto.create';
import { ConfigService } from '@nestjs/config';
import { AuthTokensDto } from './dto/auth.dto.tokens';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  validate(data: AuthLoginDto): Promise<User | null> {
    return this.usersService.validateUser(data.username, data.password);
  }

  login(user: User) {
    return this.getTokens(user);
  }

  register(data: CreateUserDTO) {
    return this.usersService.create(data);
  }

  async getTokens(user: User): Promise<AuthTokensDto> {
    const payload: AuthPayload = { id: user.id, username: user.username };

    const token = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_SECRET') ?? 'secret',
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.get<string>('JWT_REFRESH_SECRET') ?? 'secret',
      expiresIn: '7d',
    });

    await this.usersService.setRefreshToken(user.id, refreshToken);

    return { token, refreshToken };
  }

  async refreshTokens(userId: number, refreshToken: string) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const payload: AuthPayload = await this.jwtService.verifyAsync(
        refreshToken,
        {
          secret:
            this.configService.get<string>('JWT_REFRESH_SECRET') ?? 'secret',
        },
      );

      if (payload.id !== userId) {
        throw new UnauthorizedException();
      }

      if ((await this.usersService.getRefreshToken(userId)) !== refreshToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      return this.getTokens({ id: userId, username: payload.username } as User);
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }
}
