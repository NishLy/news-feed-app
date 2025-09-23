import { IsNotEmpty, IsString, Length } from 'class-validator';
export class CreateUserDTO {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  @Length(8, 255)
  password: string;
}
