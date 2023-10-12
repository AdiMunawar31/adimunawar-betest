import bcrypt from 'bcrypt';
import mongoose, { Schema } from 'mongoose';

import { BCRYPT, CONSTANT, MODELS } from '@commons/constants';
import toJSON from '@utils/toJSON.plugin';
import { IUserSchema } from '@commons/interfaces/user.interface';

const userSchema: Schema = new Schema(
  {
    userName: {
      type: String,
      required: true,
      maxlength: 50,
      trim: true,
    },
    emailAddress: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
      minlength: 6,
      private: true,
    },
    identityNumber: {
      type: String,
      required: true,
      trim: true,
      maxlength: 16,
    },
    accountNumber: {
      type: String,
      required: true,
      trim: true,
      minlength: 10,
      maxlength: 13,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre(CONSTANT.SAVE, async function (next) {
  const user = this;
  if (user.isModified(CONSTANT.PASSWORD_FIELD)) {
    user.password = await bcrypt.hash(user.password, BCRYPT.SALT_ROUNDS);
  }
  next();
});

userSchema.plugin(toJSON);

export default mongoose.model<IUserSchema>(MODELS.USERS, userSchema);
