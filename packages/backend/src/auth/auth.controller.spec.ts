import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth.dto.login';
import { CreateUserDTO } from 'src/user/dto/user.dto.create';
import { User } from 'src/user/user.entity';
import { RefreshTokenDto } from './dto/auth.dto.refresh';

// Define the expected return types
type LoginResult = { accessToken: string; refreshToken: string };
type RegisterResult = { message: string };

type MockAuthService = {
  login: jest.MockedFunction<(dto: AuthLoginDto) => Promise<LoginResult>>;
  register: jest.MockedFunction<
    (dto: CreateUserDTO) => Promise<RegisterResult>
  >;
  validate: jest.MockedFunction<(dto: AuthLoginDto) => Promise<User | null>>;
  refreshTokens: jest.MockedFunction<
    (userId: number, refreshToken: string) => Promise<LoginResult>
  >;
  getTokens: jest.MockedFunction<
    (user: User) => Promise<{ accessToken: string; refreshToken: string }>
  >;
};

const mockUserService = {
  create: jest.fn(),
};

describe('AuthController', () => {
  let authController: AuthController;
  let authService: MockAuthService;

  beforeEach(async () => {
    const mockAuthService: MockAuthService = {
      login: jest.fn(),
      register: jest.fn(),
      validate: jest.fn(),
      refreshTokens: jest.fn(),
      getTokens: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
        {
          provide: 'UserService',
          useValue: mockUserService,
        },
      ],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = mockAuthService;
  });

  it('should call register with correct data', async () => {
    const dto: CreateUserDTO = {
      username: 'newuser',
      password: 'newpass123',
    };
    const expectedResult = { message: 'User registered successfully' };

    authService.register.mockResolvedValue(expectedResult);

    const result = await authController.register(dto);

    expect(result).toEqual(expectedResult);
    expect(authService.register).toHaveBeenCalledWith(dto);
    expect(authService.register).toHaveBeenCalledTimes(1);
  });

  it('should login and return tokens', async () => {
    const dto = { username: 'admin', password: 'password123' };

    const fakeUser = {
      id: 1,
      username: 'admin',
      passwordHash: 'hashed',
      createdAt: new Date(),
    } as User;

    const fakeTokens: LoginResult = {
      accessToken: 'access123',
      refreshToken: 'refresh123',
    };

    authService.validate.mockResolvedValue(fakeUser);
    authService.login.mockResolvedValue(fakeTokens);

    const result = await authController.login(dto);

    expect(authService.validate).toHaveBeenCalledWith(dto);
    expect(authService.login).toHaveBeenCalledWith(fakeUser);
    expect(result).toEqual(fakeTokens);
  });

  it('should call refreshToken with correct data', async () => {
    const dto: RefreshTokenDto = { id: 1, refreshToken: 'refresh123' };
    const expectedResult: LoginResult = {
      accessToken: 'newAccess123',
      refreshToken: 'newRefresh123',
    };

    authService.refreshTokens.mockResolvedValue(expectedResult);
    const result = await authController.refresh(dto);

    expect(result).toEqual(expectedResult);
    expect(authService.refreshTokens).toHaveBeenCalledWith(
      dto.id,
      dto.refreshToken,
    );
  });
});
