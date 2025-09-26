/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private authService: AuthService) {}

  // eslint-disable-next-line @typescript-eslint/require-await
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const ctx = context.switchToHttp();
    const req = ctx.getRequest<Request>();
    const res = ctx.getResponse<Response>();

    const authHeader = req?.headers['authorization'];
    const accessToken = authHeader?.split(' ')[1];
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const refreshToken = req?.cookies['refresh_token'] as string;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    const userId = req?.cookies['user_id'] as string;

    if (accessToken) {
      const user = this.authService.validateAccessToken(accessToken);

      if (user) {
        req['user'] = user;
        return true;
      }
    }

    if (refreshToken) {
      try {
        const newAccessTokens = await this.authService.refreshTokens(
          Number(userId),
          refreshToken,
        );

        res.cookie('refresh_token', newAccessTokens.refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 1000 * 60 * 60 * 24 * 7,
        });

        res.cookie('user_id', userId, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 1000 * 60 * 60 * 24 * 7,
        });

        const newUser = this.authService.validateAccessToken(
          newAccessTokens.token,
        );
        req['user'] = newUser;
        return true;
      } catch (err) {
        throw new UnauthorizedException('Invalid refresh token');
      }
    }

    throw new UnauthorizedException('Unauthorized');
  }
}
