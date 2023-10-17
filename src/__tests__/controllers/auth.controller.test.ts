import { expect } from 'chai';
import sinon from 'sinon';

import { AuthService, TokenService, UserService } from '@services/v1';
import { AuthControllerV1 } from '@controllers/v1';
import RegisterDto from '@dtos/auth/register.dto';
import LoginDto from '@dtos/auth/login.dto';

describe('AuthController', () => {
  let authController: any;
  let tokenService: any;
  let userService: any;
  let authService: any;

  before(() => {
    // Membuat instance dari controller dan stubing pustaka-pustaka terkait
    tokenService = new TokenService();
    userService = new UserService();
    authService = new AuthService();
    authController = new AuthControllerV1();
    sinon.stub(authController, 'tokenService').value(tokenService);
    sinon.stub(authController, 'userService').value(userService);
    sinon.stub(authController, 'authService').value(authService);
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const createUserStub = sinon.stub(userService, 'createUser').resolves({
        emailAddress: 'adimunawar@example.com',
        userName: 'adimunawar',
        password: 'Test123',
        accountNumber: '1234567890',
        identityNumber: '1234567890123456',
        id: '7984179364187298'
      });

      const userData = new RegisterDto();
      userData.emailAddress = 'adimunawar@example.com';
      userData.userName = 'adimunawar';
      userData.password = 'Test123';
      userData.accountNumber = '1234567890';
      userData.identityNumber = '1234567890123456';

      const user = await authController.register(userData);
      const tokens = {};

      expect(createUserStub.calledWith(userData)).to.be.true;
      expect(user).to.deep.equal({
        user: {
          emailAddress: 'adimunawar@example.com',
          userName: 'adimunawar',
          password: 'Test123',
          accountNumber: '1234567890',
          identityNumber: '1234567890123456',
          id: '7984179364187298'
        },
        tokens
      });
    });
  });

  describe('login', () => {
    it('should log in a user', async () => {
      // Membuat stub untuk authService.loginUserWithEmailAndPassword
      const loginUserStub = sinon.stub(authService, 'loginUserWithEmailAndPassword').resolves({
        emailAddress: 'adimunawar@example.com',
        password: 'Test123',
      });
      
      const userData = new LoginDto();
      userData.emailAddress = 'adimunawar@example.com';
      userData.password = 'Test123';

      const user = await authController.login(userData);
      const tokens = {};

      expect(loginUserStub.calledWith(userData.emailAddress, userData.password)).to.be.true;
      expect(user).to.deep.equal({
        user: {
          emailAddress: 'adimunawar@example.com',
          password: 'Test123',
        },
        tokens
      });
    });
  });

  describe('logout', () => {
    it('should log out a user', async () => {
      // Membuat stub untuk authService.logout
      const logoutStub = sinon.stub(authService, 'logout').resolves();
  
      const userData = { refreshToken: 'dummy-refresh-token' };

      const result = await authController.logout(userData);
      
      expect(logoutStub.calledWith(userData.refreshToken)).to.be.true;
      expect(result).to.deep.equal({ message: 'logout success' });
    });
  });

  describe('refreshToken', () => {
    it('should refresh user token and refresh token', async () => {
      // Membuat stub untuk authService.refreshAuth
      const refreshAuthStub = sinon.stub(authService, 'refreshAuth').resolves({});
  
      const userData = { refreshToken: 'dummy-refresh-token' };

      const result = await authController.refreshToken(userData);
      
      expect(refreshAuthStub.calledWith(userData.refreshToken)).to.be.true;
      expect(result).to.deep.equal({ /* data dummy hasil refreshToken */ });
    });
  });

  describe('forgotPassword', () => {
    it('should send reset token to reset the password', async () => {
      // Membuat stub untuk tokenService.generateResetPasswordToken
      const generateResetPasswordTokenStub = sinon.stub(tokenService, 'generateResetPasswordToken').resolves('reset-token');
    
      const userData = { emailAddress: 'adimunawar' };

      const result = await authController.forgotPassword(userData);
      
      expect(generateResetPasswordTokenStub.calledWith(userData.emailAddress)).to.be.true;
      expect(result).to.deep.equal({ token: 'reset-token' });
    });
  });

  describe('resetPassword', () => {
    it('should reset user password', async () => {
      // Membuat stub untuk authService.resetPassword
      const resetPasswordStub = sinon.stub(authService, 'resetPassword').resolves();
    
      const userData = { token: 'reset-token', password: 'new-password' };

      const result = await authController.resetPassword(userData);
      
      expect(resetPasswordStub.calledWith(userData.token, userData.password)).to.be.true;
      expect(result).to.deep.equal({ message: 'password successfully updated' });
    });
  });

  after(() => {
    sinon.restore();
  });
});
