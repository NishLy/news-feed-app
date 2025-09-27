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
import { ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@Controller('api')
export class FollowController {
  constructor(private followsService: FollowService) {}

  @ApiResponse({
    status: 200,
    description: 'Success create a follow',
    example: {
      message: 'you are now following user 2',
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not Found',
    example: {
      statusCode: 404,
      message: 'User not found',
      error: 'NotFoundException',
      timestamp: '2025-09-27T05:13:56.002Z',
      path: '/api/follow/2',
    },
  })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  @ApiBearerAuth()
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

  @ApiResponse({
    status: 200,
    description: 'Success delete a follow',
    example: {
      message: 'you unfollowed user 2',
    },
  })
  @ApiResponse({
    status: 404,
    description: 'User not Found',
    example: {
      statusCode: 404,
      message: 'User not found',
      error: 'NotFoundException',
      timestamp: '2025-09-27T05:13:56.002Z',
      path: '/api/follow/2',
    },
  })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  @ApiBearerAuth()
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
