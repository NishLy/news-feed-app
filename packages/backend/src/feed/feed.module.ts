import { Module } from '@nestjs/common';
import { PostModule } from 'src/post/post.module';
import { FeedController } from './feed.controller';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PostModule, AuthModule],
  controllers: [FeedController],
})
export class FeedModule {}
