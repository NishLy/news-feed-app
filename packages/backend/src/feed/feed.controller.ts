import {
  Controller,
  Request,
  Body,
  UseGuards,
  Query,
  Get,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/auth.guard.jwt';
import { PaginationDto } from 'src/common/dto/pagination';
import { PostService } from 'src/post/post.service';

@Controller('api')
export class FeedController {
  constructor(private postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Get('feed')
  getPosts(@Query() pagination: PaginationDto) {
    return this.postService.getPosts(pagination.page, pagination.limit);
  }
}
