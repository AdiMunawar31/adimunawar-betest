import request from 'supertest';
import { TokenService } from '@services/v1/token.service';

describe('TokenService', () => {
  let tokenService: any;

  beforeEach(() => {
    tokenService = new TokenService();
  });

  describe('generateAuthTokens', () => {
    it('should generate auth tokens for a user', async () => {
      const user = {
        id: 'user_id',
      };

      const authTokens = await tokenService.generateAuthTokens(user);

      expect(authTokens).toHaveProperty('access');
      expect(authTokens).toHaveProperty('refresh');
      expect(authTokens.access).toHaveProperty('token');
      expect(authTokens.access).toHaveProperty('expires');
      expect(authTokens.refresh).toHaveProperty('token');
      expect(authTokens.refresh).toHaveProperty('expire');
    });
  });

  describe('generateToken', () => {
    it('should generate a JWT token', () => {
      const userId = 'user_id';
      const expire = 1234567890;
      const type = 'ACCESS';

      const token = tokenService.generateToken(userId, expire, type);

      expect(token).toBeTruthy();
    });
  });

  describe('saveToken', () => {
    it('should save a token to the database', async () => {
      const mockCreate = jest.fn();
      tokenService.saveToken = mockCreate;

      const token = 'your_token_here';
      const userId = 'user_id';
      const expires = new Date();
      const type = 'RESET_PASSWORD';

      await tokenService.saveToken(token, userId, expires, type);

      expect(mockCreate).toHaveBeenCalledWith({
        token,
        userId,
        expires,
        type,
        blacklisted: false,
      });
    });
  });

  describe('verifyToken', () => {
    it('should verify and retrieve a token from the database', async () => {
      const mockFindOne = jest.fn().mockReturnValue({});
      tokenService.verifyToken = mockFindOne;

      const token = 'your_token_here';
      const type = 'RESET_PASSWORD';

      const tokenDoc = await tokenService.verifyToken(token, type);

      expect(mockFindOne).toHaveBeenCalledWith({ token, type, userId: expect.any(String), blacklisted: false });
    });

    it('should throw an error if the token is not found', async () => {
      const mockFindOne = jest.fn().mockReturnValue(null);
      tokenService.verifyToken = mockFindOne;

      const token = 'invalid_token';

      try {
        await tokenService.verifyToken(token, 'INVALID_TYPE');
      } catch (error) {
        expect(error.message).toBe('Token not found');
      }
    });
  });
  describe('generateResetPasswordToken', () => {
    it('should generate a reset password token for a user', async () => {
      tokenService.userService.getUserByEmail = jest.fn().mockReturnValue({
        id: 'user_id',
      });

      const emailAddress = 'user@example.com';
      const resetPasswordToken = await tokenService.generateResetPasswordToken(emailAddress);

      expect(tokenService.userService.getUserByEmail).toHaveBeenCalledWith(emailAddress);
      expect(resetPasswordToken).toBeTruthy();
    });

    it('should throw an error if the user does not exist', async () => {
      tokenService.userService.getUserByEmail = jest.fn().mockReturnValue(null);

      const emailAddress = 'non_existent@example.com';

      try {
        await tokenService.generateResetPasswordToken(emailAddress);
      } catch (error) {
        expect(error.message).toBe('User not exists with this email');
      }
    });
  });
});
