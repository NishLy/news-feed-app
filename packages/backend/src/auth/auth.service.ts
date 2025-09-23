import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/user/user.service';
import { AuthLoginDto } from './dto/auth.dto.login';
import { User } from 'src/user/user.entity';
import { AuthPayload } from './types/jwt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  validate(data: AuthLoginDto): Promise<User | null> {
    return this.usersService.validateUser(data.password, data.password);
  }

  login(user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
    const payload: AuthPayload = { id: user.id, username: user.username };
    return {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      access_token: this.jwtService.sign(payload),
    };
  }
}
