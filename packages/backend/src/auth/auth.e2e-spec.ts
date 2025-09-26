/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { AuthTokensDto } from './dto/auth.dto.tokens';
import { CreateUserDTO } from 'src/user/dto/user.dto.create';
import { User } from 'src/user/user.entity';
import { CustomExceptionFilter } from 'src/common/exception.filter';
import * as cookieParser from 'cookie-parser';
import TestAgent from 'supertest/lib/agent';

describe('Auth flow (e2e)', () => {
  let app: INestApplication;
  let createdUser: User;
  let agent: InstanceType<typeof TestAgent>;
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
    app.use(cookieParser());
    await app.init();
    agent = request.agent(app.getHttpServer());
  });

  it('should register a user', async () => {
    const res = await agent.post('/api/register').send(fakeUser).expect(201);

    createdUser = res.body as User;
    expect(createdUser.id).toBeDefined();
    expect(createdUser.username).toBe(fakeUser.username);
  });

  it('should reject register wrong data', async () => {
    await agent.post('/api/register').send({ username: '' }).expect(400);
  });

  it('should reject duplicate registration', async () => {
    await agent.post('/api/register').send(fakeUser).expect(409);
  });

  it('should login and return tokens', async () => {
    const res = await agent.post('/api/login').send(fakeUser).expect(200);

    const { token } = res.body as AuthTokensDto;
    expect(token).toBeDefined();
  });

  it('should reject invalid cred', async () => {
    await agent
      .post('/api/login')
      .send({ username: fakeUser.username, password: 'wrong123123' })
      .expect(401);
  });

  afterAll(async () => {
    await app.close();
  });
});
