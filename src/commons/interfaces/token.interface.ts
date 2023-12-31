import ITimesStamp from '@commons/interfaces/timestamp.interface';
import { IsBoolean, IsDate, IsString } from 'class-validator';
import { Document } from 'mongoose';

export class IToken extends ITimesStamp {
  @IsString()
  token: string;

  @IsString()
  userId: string;

  @IsString()
  type: string;

  @IsDate()
  expires: Date;

  @IsBoolean()
  blacklisted: boolean;
}

export interface ITokenSchema extends Document, IToken {}
