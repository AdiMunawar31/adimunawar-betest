import ITimesStamp from '@commons/interfaces/timestamp.interface';
import { IsBoolean, IsEmail, IsString } from 'class-validator';
import { Document } from 'mongoose';

export class IUser extends ITimesStamp {
  @IsString()
  userName: string;

  @IsEmail()
  emailAddress: string;

  @IsString()
  password: string;

  @IsString()
  identityNumber: string;

  @IsString()
  accountNumber: string;

  @IsBoolean()
  isEmailVerified: boolean;
}

export interface IUserSchema extends Document, IUser {}
