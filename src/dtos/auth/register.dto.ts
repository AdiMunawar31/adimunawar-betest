import { IsEmail, IsNotEmpty, IsString, MaxLength, MinLength } from 'class-validator';

export default class RegisterDto {
  @IsNotEmpty()
  @IsEmail()
  emailAddress: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  userName: string;

  @MinLength(6)
  password: string;

  @IsString()
  @MinLength(10)
  @MaxLength(13)
  accountNumber: string;

  @IsString()
  @MaxLength(16)
  identityNumber: string;
}
