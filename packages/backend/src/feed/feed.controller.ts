import {
  Controller,
  Request,
  Body,
  UseGuards,
  Query,
  Get,
} from '@nestjs/common';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/auth.guard.jwt';
import { PaginationDto } from 'src/common/dto/pagination';
import { PostService } from 'src/post/post.service';

@Controller('api')
export class FeedController {
  constructor(private postService: PostService) {}

  @ApiResponse({
    status: 200,
    description: 'Get feeds',
    example: {
      posts: [
        {
          id: 2,
          user: {
            id: 1,
            username: 'admin',
            createdAt: '2025-09-27T04:35:10.397Z',
          },
          content: 'Hello World',
          createdAt: '2025-09-27T05:11:21.696Z',
        },
        {
          id: 1,
          user: {
            id: 1,
            username: 'admin',
            createdAt: '2025-09-27T04:35:10.397Z',
          },
          content: 'Hello World',
          createdAt: '2025-09-27T05:10:38.252Z',
        },
      ],
      total: 6,
      page: 1,
      lastPage: 1,
    },
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('feed')
  getPosts(@Query() pagination: PaginationDto) {
    return this.postService.getPosts(pagination.page, pagination.limit);
  }
}
