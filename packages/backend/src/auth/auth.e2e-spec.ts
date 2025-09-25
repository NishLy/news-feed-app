import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { AuthTokensDto } from './dto/auth.dto.tokens';
import { CreateUserDTO } from 'src/user/dto/user.dto.create';
import { User } from 'src/user/user.entity';

describe('Auth flow (e2e)', () => {
  let app: INestApplication;
  const fakeUser: CreateUserDTO = {
    username: 'admin' + Math.floor(Math.random() * 10000),
    password: 'password123',
  };

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should login and refresh token', async () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const createRes = await request(app.getHttpServer())
      .post('/api/register')
      .send(fakeUser)
      .expect(201);

    const createdUser = createRes.body as User;
    expect(createdUser.id).toBeDefined();
    expect(createdUser.username).toBe(fakeUser.username);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const loginRes = await request(app.getHttpServer())
      .post('/api/login')
      .send(fakeUser)
      .expect(201);

    const { accessToken, refreshToken } = loginRes.body as AuthTokensDto;

    expect(accessToken).toBeDefined();
    expect(refreshToken).toBeDefined();

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    const refreshRes = await request(app.getHttpServer())
      .post('/api/refreshToken')
      .send({ id: createdUser.id, refreshToken })
      .expect(201);

    const body = refreshRes.body as AuthTokensDto;

    expect(body.accessToken).toBeDefined();
    expect(body.refreshToken).toBeDefined();
  });

  afterAll(async () => {
    await app.close();
  });
});
