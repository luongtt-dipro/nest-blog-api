import { IsNotEmpty, IsString } from 'class-validator';

export class LoginFakeDTO {
  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}
