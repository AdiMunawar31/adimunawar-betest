import { IsBoolean, IsDate, IsString } from 'class-validator';
import { Document, ObjectId } from 'mongoose';

import ITimesStamp from '@commons/interfaces/timestamp.interface';

export class IToken extends ITimesStamp {
  @IsString()
  token: string;

  @IsString()
  userId: ObjectId;

  @IsString()
  type: string;

  @IsDate()
  expires: Date;

  @IsBoolean()
  blacklisted: boolean;
}

export interface ITokenSchema extends Document, IToken {}
