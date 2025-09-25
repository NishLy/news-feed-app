/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { CreateUserDTO } from 'src/user/dto/user.dto.create';
import { CustomExceptionFilter } from 'src/common/exception.filter';
import { AuthTokensDto } from 'src/auth/dto/auth.dto.tokens';
import { Post } from './post.entity';

describe('Auth flow (e2e)', () => {
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
      .expect(201);

    const { token: tk, refreshToken: rt } = res.body as AuthTokensDto;
    expect(tk).toBeDefined();
    expect(rt).toBeDefined();

    token = tk;
  });

  it('should succefully post "Post"', async () => {
    const text: string = 'Hello world';
    const res = await request(app.getHttpServer())
      .post('/api/posts')
      .set('Authorization', 'Bearer ' + token)
      .send({ content: text })
      .expect(201);

    const post = res.body as Post;

    expect(post).toBeDefined();
    expect(post.id).toBeDefined();
    expect(post.content).toBe(text);
    expect(post.createdAt).toBeDefined();
  });

  it('should reject "Post" that have content length more than 200', async () => {
    const text: string = 'Hello world '.repeat(20);
    await request(app.getHttpServer())
      .post('/api/posts')
      .set('Authorization', 'Bearer ' + token)
      .send({ content: text })
      .expect(400);
  });
});
