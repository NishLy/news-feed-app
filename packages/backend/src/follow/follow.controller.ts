import {
  Controller,
  Request,
  Post,
  Body,
  UseGuards,
  Param,
  ParseIntPipe,
  Delete,
  HttpStatus,
  HttpCode,
  BadRequestException,
} from '@nestjs/common';
import { AuthPayload } from 'src/auth/types/jwt';
import { JwtAuthGuard } from 'src/auth/auth.guard.jwt';
import { FollowService } from './follow.service';

@Controller('api')
export class FollowController {
  constructor(private followsService: FollowService) {}

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Post('follow/:followeeId')
  async follow(
    @Request() req: Request & { user: AuthPayload },
    @Param('followeeId', ParseIntPipe) followeeId: number,
  ) {
    if (req.user.id === followeeId)
      throw new BadRequestException("You can't follow yourself");
    await this.followsService.create(req.user.id, followeeId);
    return { message: `you are now following user ${followeeId}` };
  }

  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @Delete('follow/:followeeId')
  async unfollow(
    @Request() req: Request & { user: AuthPayload },
    @Param('followeeId', ParseIntPipe) followeeId: number,
  ) {
    await this.followsService.remove(req.user.id, followeeId);
    return { message: `you unfollowed user ${followeeId}` };
  }
}
