import { IsString } from 'class-validator';

export class AuthTokensDto {
  @IsString()
  token: string;

  @IsString()
  refreshToken: string;
}
