import { TokenTypes } from '@commons/constants';
import bcrypt from 'bcrypt';
import { NotFoundError, UnauthorizedError } from 'routing-controllers';

import Tokens from '@models/tokens.model';
import { TokenService, UserService } from '@services/v1';

export class AuthService {
  public tokenModel = Tokens;
  private userService = new UserService();
  private tokenService = new TokenService();

  async loginUserWithEmailAndPassword(emailAddress: string, password: string) {
    const user = await this.userService.getUserByEmail(emailAddress);

    if (!user || !(await this.comparePassword(password, user.password))) {
      throw new UnauthorizedError('Invalid credentials');
    }

    return user;
  }

  async logout(refreshToken: string) {
    const token = await this.tokenModel.findOne({ token: refreshToken, type: TokenTypes.REFRESH, blacklisted: false });

    if (!token) {
      throw new NotFoundError('Token Not Found');
    }

    await token.remove();
  }

  async refreshAuth(refreshToken: string) {
    try {
      const refreshTokenDoc = await this.tokenService.verifyToken(refreshToken, TokenTypes.REFRESH);
      const user = await this.userService.getById(refreshTokenDoc.userId);
      if (!user) {
        throw new Error();
      }

      await refreshTokenDoc.remove();
      const tokens = await this.tokenService.generateAuthTokens(user);
      return { user, tokens };
    } catch (error) {
      if (error.message === 'Token not found' || error.message === 'jwt expired') {
        throw new UnauthorizedError('Token not found');
      }
      throw new UnauthorizedError('An error occurred during authentication. Please reauthenticate');
    }
  }

  async resetPassword(token: string, password: string) {
    try {
      const tokenDoc = await this.tokenService.verifyToken(token, TokenTypes.RESET_PASSWORD);
      const user = await this.userService.getById(tokenDoc.userId);
      if (!user) {
        throw new NotFoundError('User not found');
      }

      await this.userService.updateById(user.id, { password });
      await this.tokenModel.deleteMany({ userId: user.id });
    } catch (error) {
      if (error.message === 'Token not found' || error.message === 'jwt expired') {
        throw new UnauthorizedError('Token not found');
      }
      throw error;
    }
  }

  async comparePassword(inputPass: string, userPass: string) {
    return await bcrypt.compare(inputPass, userPass);
  }
}
