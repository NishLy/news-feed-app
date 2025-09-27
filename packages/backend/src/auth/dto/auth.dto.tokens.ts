import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class AuthTokensDto {
  @ApiProperty({ description: 'The token of validated user' })
  @IsString()
  token: string;

  @ApiProperty({ description: 'The refresh token of validated user' })
  @IsString()
  refreshToken: string;
}
