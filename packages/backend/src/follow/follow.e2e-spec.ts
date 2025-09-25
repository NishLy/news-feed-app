/* eslint-disable @typescript-eslint/no-unsafe-argument */
import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from 'src/app.module';
import { CreateUserDTO } from 'src/user/dto/user.dto.create';
import { CustomExceptionFilter } from 'src/common/exception.filter';
import { AuthTokensDto } from 'src/auth/dto/auth.dto.tokens';

describe('Auth flow (e2e)', () => {
  let app: INestApplication;
  let token: string;
  const targetUserId = 4;
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

  it('should follow user', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/follow/' + targetUserId)
      .set('Authorization', 'Bearer ' + token)
      .expect(200);

    const body = res.body as { message: string };
    expect(body.message).toBe('you are now following user ' + targetUserId);
  });

  it('should not follow non existent user', async () => {
    await request(app.getHttpServer())
      .post('/api/follow/' + -122)
      .set('Authorization', 'Bearer ' + token)
      .expect(404);
  });

  it('should unfollow user', async () => {
    const res = await request(app.getHttpServer())
      .delete('/api/follow/' + targetUserId)
      .set('Authorization', 'Bearer ' + token)
      .expect(200);

    const body = res.body as { message: string };
    expect(body.message).toBe('you unfollowed user ' + targetUserId);
  });

  it('should not unfollow non existent user', async () => {
    await request(app.getHttpServer())
      .delete('/api/follow/' + -122)
      .set('Authorization', 'Bearer ' + token)
      .expect(404);
  });
});
