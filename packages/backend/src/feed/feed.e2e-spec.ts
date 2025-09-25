/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { CreateUserDTO } from 'src/user/dto/user.dto.create';
import { CustomExceptionFilter } from 'src/common/exception.filter';
import { AuthTokensDto } from 'src/auth/dto/auth.dto.tokens';
import { Post } from 'src/post/post.entity';

describe('Feed flow (e2e)', () => {
  let app: INestApplication;
  let token: string;
  const fakeUser: CreateUserDTO = {
    username: 'admin',
    password: 'password123',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalFilters(new CustomExceptionFilter());
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );
    await app.init();
  });

  it('should login and return tokens', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/login')
      .send(fakeUser)
      .expect(200);

    const { token: tk, refreshToken: rt } = res.body as AuthTokensDto;
    expect(tk).toBeDefined();
    expect(rt).toBeDefined();

    token = tk;
  });

  it('should seed feeds', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/feed?page=${1}&limit=${5}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(200);

    const { posts, page } = res.body as {
      posts: Post[];
      total: number;
      page: number;
      lastPage: number;
    };

    expect(posts).toBeDefined();
    expect(posts.length).toBeGreaterThan(0);
    expect(page).toBe(1);
  });
});
