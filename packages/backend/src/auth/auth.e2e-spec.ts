/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { AuthTokensDto } from './dto/auth.dto.tokens';
import { CreateUserDTO } from 'src/user/dto/user.dto.create';
import { User } from 'src/user/user.entity';
import { CustomExceptionFilter } from 'src/common/exception.filter';

describe('Auth flow (e2e)', () => {
  let app: INestApplication;
  let createdUser: User;
  let refreshToken: string;
  const fakeUser: CreateUserDTO = {
    username: 'admin' + Math.floor(Math.random() * 10000),
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

  it('should register a user', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/register')
      .send(fakeUser)
      .expect(201);

    createdUser = res.body as User;
    expect(createdUser.id).toBeDefined();
    expect(createdUser.username).toBe(fakeUser.username);
  });

  it('should reject register wrong data', async () => {
    await request(app.getHttpServer())
      .post('/api/register')
      .send({ username: '' })
      .expect(400);
  });

  it('should reject duplicate registration', async () => {
    await request(app.getHttpServer())
      .post('/api/register')
      .send(fakeUser)
      .expect(409);
  });

  it('should login and return tokens', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/login')
      .send(fakeUser)
      .expect(200);

    const { token, refreshToken: rt } = res.body as AuthTokensDto;
    expect(token).toBeDefined();
    expect(rt).toBeDefined();

    refreshToken = rt;
  });

  it('should reject invalid cred', async () => {
    await request(app.getHttpServer())
      .post('/api/login')
      .send({ username: fakeUser.username, password: 'wrong123123' })
      .expect(401);
  });

  it('should refresh tokens with valid refresh token', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/refreshToken')
      .send({ id: createdUser.id, refreshToken })
      .expect(200);

    const body = res.body as AuthTokensDto;
    expect(body.token).toBeDefined();
    expect(body.refreshToken).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });
});
