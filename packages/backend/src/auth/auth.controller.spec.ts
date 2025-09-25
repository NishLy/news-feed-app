import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth.dto.login';
import { CreateUserDTO } from 'src/user/dto/user.dto.create';
import { User } from 'src/user/user.entity';

// Define the expected return types
type LoginResult = { access_token: string };
type RegisterResult = { message: string };

type MockAuthService = {
  login: jest.MockedFunction<(dto: AuthLoginDto) => Promise<LoginResult>>;
  register: jest.MockedFunction<
    (dto: CreateUserDTO) => Promise<RegisterResult>
  >;
  validate: jest.MockedFunction<(dto: AuthLoginDto) => Promise<User | null>>;
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

  it('should call login with correct data', async () => {
    const dto: AuthLoginDto = { username: 'admin', password: 'password123' };
    const expectedResult = { access_token: 'test-token' };

    const fakeUser = {
      id: 1,
      username: 'admin',
      passwordHash: 'hashed',
      createdAt: new Date(),
    } as unknown as User;

    authService.validate.mockResolvedValue({
      id: 1,
      username: 'admin',
      passwordHash: 'hashed',
      createdAt: new Date(),
    } as unknown as User);

    authService.login.mockResolvedValue(expectedResult);

    const result = await authController.login(dto);

    expect(result).toEqual(expectedResult);
    expect(authService.validate).toHaveBeenCalledWith(dto);
    expect(authService.login).toHaveBeenCalledWith(fakeUser);
  });
});
