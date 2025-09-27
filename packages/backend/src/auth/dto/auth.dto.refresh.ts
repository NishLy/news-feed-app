import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString } from 'class-validator';

export class RefreshTokenDto {
  @ApiProperty({ description: 'The id of user' })
  @IsNumber()
  id: number;

  @ApiProperty({ description: 'Refresh token for user' })
  @IsString()
  refreshToken: string;
}
