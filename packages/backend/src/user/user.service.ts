import { ConflictException, Injectable } from '@nestjs/common';
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

  async create(data: CreateUserDTO) {
    const isExist = await this.findByUsername(data.username);
    if (isExist) throw new ConflictException('Username already exists');
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
    const user = await this.usersRepo
      .createQueryBuilder('user')
      .addSelect('user.passwordHash')
      .where('user.username = :username', { username })
      .getOne();
    if (user && (await user.comparePassword(password))) {
      return user;
    }
    return null;
  }

  async findByUsername(username: string) {
    return this.usersRepo.findOne({ where: { username } });
  }

  async setRefreshToken(userId: number, refreshToken: string) {
    const user = await this.findById(userId);
    if (user) {
      user.refreshToken = refreshToken;
      await this.usersRepo.save(user);
    }
  }

  async removeRefreshToken(userId: number) {
    const user = await this.findById(userId);
    if (user) {
      user.refreshToken = undefined;
      await this.usersRepo.save(user);
    }
  }

  async getRefreshToken(userId: number): Promise<string | null> {
    const user = await this.usersRepo
      .createQueryBuilder('user')
      .addSelect('user.refreshToken')
      .where('user.id = :id', { id: userId })
      .getOne();
    return user?.refreshToken ?? null;
  }
}
