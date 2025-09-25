import { Controller, Request, Post, Body, UseGuards } from '@nestjs/common';
import { CreatePostDto } from './dto/post.dto.create';
import { PostService } from './post.service';
import { AuthPayload } from 'src/auth/types/jwt';
import { JwtAuthGuard } from 'src/auth/auth.guard.jwt';

@Controller('api')
export class PostController {
  constructor(private postService: PostService) {}

  @UseGuards(JwtAuthGuard)
  @Post('posts')
  createPost(
    @Body() createPostDto: CreatePostDto,
    @Request() req: Request & { user: AuthPayload },
  ) {
    return this.postService.create(req.user.id, createPostDto);
  }
}
