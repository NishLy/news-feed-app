import { Module } from '@nestjs/common';
import { PostModule } from 'src/post/post.module';
import { FeedController } from './feed.controller';

@Module({
  imports: [PostModule],
  controllers: [FeedController],
})
export class FeedModule {}
