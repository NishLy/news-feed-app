import { IsNumber, IsString } from 'class-validator';

export class RefreshTokenDto {
  @IsNumber()
  id: number;

  @IsString()
  refreshToken: string;
}
