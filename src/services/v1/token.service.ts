import { TokenTypes } from '@commons/constants';
import { IUserSchema } from '@commons/interfaces/user.interface';
import jsonwebtoken from 'jsonwebtoken';
import moment from 'moment';
import { NotFoundError } from 'routing-controllers';

import Tokens from '@models/tokens.model';

import { jwt } from '../../configs';

import { UserService } from './user.service';

export class TokenService {
  private userService = new UserService();

  async generateAuthTokens(user: IUserSchema) {
    const accessTokenExpire = moment().add(jwt.accessExpireIn as moment.unitOfTime.DurationConstructor, jwt.accessExpireFormat);
    const accessToken = this.generateToken(user.id, accessTokenExpire.unix(), TokenTypes.ACCESS);

    const refreshTokenExpire = moment().add(jwt.refreshExpireIn as moment.unitOfTime.DurationConstructor, jwt.refreshExpireFormat);
    const refreshToken = this.generateToken(user.id, refreshTokenExpire.unix(), TokenTypes.REFRESH);

    await this.saveToken(refreshToken, user.id, refreshTokenExpire.toDate(), TokenTypes.REFRESH);

    return {
      access: {
        token: accessToken,
        expires: accessTokenExpire.unix(),
      },
      refresh: {
        token: refreshToken,
        expire: refreshTokenExpire.unix(),
      },
    };
  }

  generateToken(userId: string, expire: number, type: string) {
    const payload = {
      sub: userId,
      iat: moment().unix(),
      exp: expire,
      type,
    };

    return jsonwebtoken.sign(payload, jwt.secret);
  }

  async saveToken(token: string, userId: string, expires: Date, type: TokenTypes, blacklisted = false) {
    return await Tokens.create({
      token,
      userId,
      expires,
      type,
      blacklisted,
    });
  }

  async verifyToken(token: string, type: string) {
    const payload = jsonwebtoken.verify(token, jwt.secret);
    const tokenDoc = await Tokens.findOne({ token, type, userId: payload.sub, blacklisted: false });
    if (!tokenDoc) {
      throw new Error('Token not found');
    }
    return tokenDoc;
  }

  async generateResetPasswordToken(emailAddress: string) {
    const user = await this.userService.getUserByEmail(emailAddress);
    if (!user) {
      throw new NotFoundError('User not exists with this email');
    }

    const expireIn = moment().add(jwt.resetPasswordExpireIn as moment.unitOfTime.DurationConstructor, jwt.resetPasswordExpireFormat);
    const resetPasswordToken = this.generateToken(user.id, expireIn.unix(), TokenTypes.RESET_PASSWORD);
    await this.saveToken(resetPasswordToken, user.id, expireIn.toDate(), TokenTypes.RESET_PASSWORD);

    return resetPasswordToken;
  }
}
