import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { AuthLoginDto } from './dto/auth.dto.login';
import { User } from 'src/user/user.entity';
import { AuthPayload } from './types/jwt';
import { CreateUserDTO } from 'src/user/dto/user.dto.create';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  validate(data: AuthLoginDto): Promise<User | null> {
    return this.usersService.validateUser(data.password, data.password);
  }

  login(user: User) {
    const payload: AuthPayload = { id: user.id, username: user.username };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  register(data: CreateUserDTO) {
    return this.usersService.create(data);
  }
}
