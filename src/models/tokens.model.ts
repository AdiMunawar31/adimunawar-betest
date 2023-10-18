import { MODELS, TokenTypes } from '@commons/constants';
import ITimesStamp from '@commons/interfaces/timestamp.interface';
import { IsBoolean, IsDate, IsString } from 'class-validator';
import mongoose, { Document, Schema } from 'mongoose';

import toJSON from '@utils/toJSON.plugin';

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

const tokenSchema: Schema = new Schema(
  {
    token: {
      type: String,
      required: true,
      index: true,
    },
    userId: {
      type: String,
      ref: MODELS.USERS,
      required: true,
    },
    type: {
      type: String,
      enum: [TokenTypes.ACCESS, TokenTypes.REFRESH, TokenTypes.RESET_PASSWORD],
      required: true,
    },
    expires: {
      type: Date,
      required: true,
    },
    blacklisted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

tokenSchema.plugin(toJSON);

export default mongoose.model<ITokenSchema>(MODELS.TOKENS, tokenSchema);
