import { Controller, Request, Post, Body, UseGuards } from '@nestjs/common';
import { CreatePostDto } from './dto/post.dto.create';
import { PostService } from './post.service';
import { AuthPayload } from 'src/auth/types/jwt';
import { JwtAuthGuard } from 'src/auth/auth.guard.jwt';
import { ApiBearerAuth, ApiResponse } from '@nestjs/swagger';

@Controller('api')
export class PostController {
  constructor(private postService: PostService) {}

  @ApiResponse({
    status: 201,
    description: 'Success create a post',
    example: {
      id: 1,
      user: {
        id: 1,
      },
      content: 'Hello World',
      createdAt: '2025-09-27T05:10:38.252Z',
    },
  })
  @ApiResponse({ status: 400, description: 'Validation failed.' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Post('posts')
  createPost(
    @Body() createPostDto: CreatePostDto,
    @Request() req: Request & { user: AuthPayload },
  ) {
    return this.postService.create(req.user.id, createPostDto);
  }
}
