import { expect } from 'chai';
import { NotFoundError, UnauthorizedError } from 'routing-controllers';
import * as sinon from 'sinon';

import { AuthService } from '@services/v1'; // Sesuaikan dengan path yang sesuai

describe('AuthService', () => {
  let authService: AuthService;
  let userService: any;
  let tokenService: any;

  beforeEach(() => {
    authService = new AuthService();
    userService = {
      getUserByEmail: sinon.stub(),
      getById: sinon.stub(),
      updateById: sinon.stub(),
    };
    tokenService = {
      verifyToken: sinon.stub(),
      generateAuthTokens: sinon.stub(),
    };

    authService['userService'] = userService;
    authService['tokenService'] = tokenService;
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('loginUserWithEmailAndPassword', () => {
    it('should throw UnauthorizedError if user is not found', async () => {
      userService.getUserByEmail.resolves(null);

      try {
        await authService.loginUserWithEmailAndPassword('nonexistent@example.com', 'password');
      } catch (error) {
        expect(error).to.be.an.instanceOf(UnauthorizedError);
        expect(error.message).to.equal('Invalid credentials');
      }
      expect(userService.getUserByEmail.calledOnceWith('nonexistent@example.com')).to.be.true;
    });

    it('should throw UnauthorizedError if password is incorrect', async () => {
      const fakeUser = {
        id: '2180473901749321',
        userName: 'adi',
        emailAddress: 'adi@example.com',
        password: '$2yiuyiuakfdkjsa284324321',
        identityNumber: '1234567890123456',
        accountNumber: '9876543210',
        isEmailVerified: true,
        createdAt: new Date('2023-10-12T13:23:51.910Z'),
        updatedAt: new Date('2023-10-13T09:02:24.235Z'),
      };

      userService.getUserByEmail.resolves(fakeUser);

      try {
        await authService.loginUserWithEmailAndPassword('adi@example.com', 'wrongpassword');
      } catch (error) {
        expect(error).to.be.an.instanceOf(UnauthorizedError);
        expect(error.message).to.equal('Invalid credentials');
      }
      expect(userService.getUserByEmail.calledOnceWith('adi@example.com')).to.be.true;
    });

    it('should throw UnauthorizedError if invalid credentials are provided', async () => {
      userService.getUserByEmail.resolves(null);

      try {
        await authService.loginUserWithEmailAndPassword('test@example.com', 'wrongpassword');
      } catch (error) {
        expect(error).to.be.an.instanceOf(UnauthorizedError);
      }
      expect(userService.getUserByEmail.calledOnceWith('test@example.com')).to.be.true;
    });
  });

  describe('logout', () => {
    it('should throw NotFoundError when logging out with invalid refreshToken', async () => {
      const invalidRefreshToken = '';
      sinon.stub(authService.tokenModel, 'findOne').resolves(null);

      try {
        await authService.logout(invalidRefreshToken);
      } catch (error) {
        expect(error).to.be.an.instanceOf(NotFoundError);
        expect(error.message).to.equal('Token Not Found');
      }
    });
  });
});
