import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from './post.entity';
import { CreatePostDto } from './dto/post.dto.create';

@Injectable()
export class PostService {
  constructor(@InjectRepository(Post) private postsRepo: Repository<Post>) {}

  findAll() {
    return this.postsRepo.find();
  }

  create(id: number, data: CreatePostDto) {
    const user = this.postsRepo.create({ ...data, user: { id } });
    return this.postsRepo.save(user);
  }

  findById(id: number) {
    return this.postsRepo.findOne({ where: { id } });
  }

  async getPosts(page = 1, limit = 10) {
    const [posts, total] = await this.postsRepo.findAndCount({
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });

    return {
      posts,
      total,
      page,
      lastPage: Math.ceil(total / limit),
    };
  }
}
