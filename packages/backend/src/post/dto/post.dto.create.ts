import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';
export class CreatePostDto {
  @ApiProperty({ example: 'Hello World', description: 'The content of post' })
  @IsString()
  @Length(0, 200)
  content: string;
}
