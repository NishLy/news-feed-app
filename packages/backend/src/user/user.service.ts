import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserDTO } from './dto/user.dto.create';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private usersRepo: Repository<User>) {}

  findAll() {
    return this.usersRepo.find();
  }

  create(data: CreateUserDTO) {
    const user = this.usersRepo.create({
      ...data,
      passwordHash: data.password,
    });
    return this.usersRepo.save(user);
  }

  findById(id: number) {
    return this.usersRepo.findOne({ where: { id } });
  }

  async validateUser(username: string, password: string): Promise<User | null> {
    const user = await this.usersRepo.findOne({ where: { username } });
    if (user && (await user.comparePassword(password))) {
      return user;
    }
    return null;
  }
}
