import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
export class CreatePostDto {
  @ApiProperty({ example: 'Hello World', description: 'The content of post' })
  @IsString()
  content: string;
}
