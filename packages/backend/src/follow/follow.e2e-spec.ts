/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { CreateUserDTO } from 'src/user/dto/user.dto.create';
import { CustomExceptionFilter } from 'src/common/exception.filter';
import { AuthTokensDto } from 'src/auth/dto/auth.dto.tokens';
import * as cookieParser from 'cookie-parser';
import TestAgent from 'supertest/lib/agent';

describe('Follow flow (e2e)', () => {
  let app: INestApplication;
  let token: string;
  let agent: InstanceType<typeof TestAgent>;
  const targetUserId = 2;
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
    app.use(cookieParser());
    await app.init();
    agent = request.agent(app.getHttpServer());
  });

  it('should login and return tokens', async () => {
    const res = await agent.post('/api/login').send(fakeUser).expect(200);

    const { token: tk } = res.body as AuthTokensDto;
    expect(tk).toBeDefined();

    token = tk;
  });

  it('should follow user', async () => {
    const res = await agent
      .post('/api/follow/' + targetUserId)
      .set('Authorization', 'Bearer ' + token)
      .expect(200);

    const body = res.body as { message: string };
    expect(body.message).toBe('you are now following user ' + targetUserId);
  });

  it('should not follow non existent user', async () => {
    await agent
      .post('/api/follow/' + -122)
      .set('Authorization', 'Bearer ' + token)
      .expect(404);
  });

  it('should unfollow user', async () => {
    const res = await agent
      .delete('/api/follow/' + targetUserId)
      .set('Authorization', 'Bearer ' + token)
      .expect(200);

    const body = res.body as { message: string };
    expect(body.message).toBe('you unfollowed user ' + targetUserId);
  });

  it('should not unfollow non existent user', async () => {
    await agent
      .delete('/api/follow/' + -122)
      .set('Authorization', 'Bearer ' + token)
      .expect(404);
  });
});
