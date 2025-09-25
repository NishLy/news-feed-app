import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Follow } from './follow.entity';
import { UserService } from 'src/user/user.service';

@Injectable()
export class FollowService {
  constructor(
    @InjectRepository(Follow) private followsRepo: Repository<Follow>,
    private readonly userService: UserService,
  ) {}

  async create(followerId: number, followeeId: number) {
    const targetUser = await this.userService.findById(followeeId);
    if (!targetUser) throw new NotFoundException('User not found');
    return await this.followsRepo.upsert({ followerId, followeeId }, [
      'followerId',
      'followeeId',
    ]);
  }

  async remove(followerId: number, followeeId: number) {
    const follow = await this.followsRepo.findOneBy({ followerId, followeeId });
    if (!follow) throw new NotFoundException('Follow relationship not found');
    return this.followsRepo.delete({ followerId, followeeId });
  }
}
