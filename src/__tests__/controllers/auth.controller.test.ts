import { AuthControllerV1 } from '@controllers/v1';
import ForgotPasswordDto from '@dtos/auth/forgotPassword.dto';
import LoginDto from '@dtos/auth/login.dto';
import LogoutDto from '@dtos/auth/logout.dto';
import RefreshTokenDto from '@dtos/auth/refreshToken.dto';
import RegisterDto from '@dtos/auth/register.dto';
import ResetPasswordDto from '@dtos/auth/resetPassword.dto';
import { expect } from 'chai';
import sinon from 'sinon';

import producerService from '@services/v1/producer.service';

describe('AuthController', () => {
  const TOKEN =
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI2NTI3ZjM2NzgyZTYyMGY1OGD8NDkxNzkiLCJpYXQiOjE2OTc1MjAwMDAsImV4cCI6MTY5NzUyMzYwMCwidHlwZSI6ImFjY2VzcyJ9.10MHT2yp8prBt-UpT6ITyhjaZgiQoLfl0iym_FU_fd4';

  let authController: any;
  let tokenService: any;
  let userService: any;
  let authService: any;
  let producerServiceSendStub: any;

  before(() => {
    tokenService = {
      generateResetPasswordToken: sinon.stub(),
      generateAuthTokens: sinon.stub(),
    };

    userService = {
      createUser: sinon.stub(),
    };

    authService = {
      loginUserWithEmailAndPassword: sinon.stub(),
      logout: sinon.stub(),
      refreshAuth: sinon.stub(),
      resetPassword: sinon.stub(),
    };

    producerServiceSendStub = sinon.stub(producerService, 'send');

    authController = new AuthControllerV1();
    authController['tokenService'] = tokenService;
    authController['userService'] = userService;
    authController['authService'] = authService;
  });

  after(() => {
    producerServiceSendStub.restore();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const userData = new RegisterDto();
      userData.emailAddress = 'adi31@gmail.com';
      userData.userName = 'adi';
      userData.password = 'Test123';
      userData.accountNumber = '1234567890';
      userData.identityNumber = '0987654321654321';

      const userMock = {
        userName: 'adi',
        emailAddress: 'adi31@gmail.com',
        identityNumber: '0987654321654321',
        accountNumber: '1234567890',
        isEmailVerified: false,
        createdAt: '2023-10-17T05:24:20.902Z',
        updatedAt: '2023-10-17T05:24:20.902Z',
        id: '652e1a84386b280062103600',
      };

      const accessTokensMock = {
        token: TOKEN,
        expires: 1697523860,
      };

      const refreshTokensMock = {
        token: TOKEN,
        expires: 1697523600,
      };

      userService.createUser.resolves(userMock);
      tokenService.generateAuthTokens.resolves({ access: accessTokensMock, refresh: refreshTokensMock });

      const result = await authController.register(userData);

      expect(userService.createUser.calledWith(userData)).to.be.true;
      expect(tokenService.generateAuthTokens.calledWith(userMock)).to.be.true;

      const expectedResponse = {
        user: userMock,
        tokens: {
          access: accessTokensMock,
          refresh: refreshTokensMock,
        },
      };

      expect(result).to.deep.equal(expectedResponse);
      expect(producerServiceSendStub.notCalled).to.be.false;
    });
  });

  describe('login', () => {
    it('should log in a user', async () => {
      const userData = new LoginDto();
      userData.emailAddress = 'adi@gmail.com';
      userData.password = 'Test123';

      const userMock = {
        userName: 'D2Y',
        emailAddress: 'adi@gmail.com',
        identityNumber: '0987654321654321',
        accountNumber: '1234567890',
        isEmailVerified: false,
        createdAt: '2023-10-12T13:23:51.910Z',
        updatedAt: '2023-10-13T09:02:24.235Z',
        id: '6527f36782e620f58d849179',
      };

      const accessTokensMock = {
        token: TOKEN,
        expires: 1697523600,
      };

      const refreshTokensMock = {
        token: TOKEN,
        expires: 1697523600,
      };

      authService.loginUserWithEmailAndPassword.resolves(userMock);
      tokenService.generateAuthTokens.resolves({ access: accessTokensMock, refresh: refreshTokensMock });

      const result = await authController.login(userData);

      expect(authService.loginUserWithEmailAndPassword.calledWith(userData.emailAddress, userData.password)).to.be.true;
      expect(tokenService.generateAuthTokens.calledWith(userMock)).to.be.true;

      const expectedResponse = {
        user: userMock,
        tokens: {
          access: accessTokensMock,
          refresh: refreshTokensMock,
        },
      };

      expect(result).to.deep.equal(expectedResponse);
    });
  });

  describe('logout', () => {
    it('should log out the user', async () => {
      const logoutDto = new LogoutDto();
      logoutDto.refreshToken = 'some-refresh-token';

      authService.logout.resolves();

      const result = await authController.logout(logoutDto);

      expect(authService.logout.calledWith(logoutDto.refreshToken)).to.be.true;
      expect(result).to.deep.equal({ message: 'logout success' });
    });
  });

  describe('refreshToken', () => {
    it('should renew user token and refresh token', async () => {
      const refreshTokenDto = new RefreshTokenDto();
      refreshTokenDto.refreshToken = 'some-refresh-token';

      const accessTokensMock = {
        token: TOKEN,
        expires: 1697523600,
      };

      const refreshTokensMock = {
        token: TOKEN,
        expires: 1697523600,
      };

      authService.refreshAuth.resolves({ access: accessTokensMock, refresh: refreshTokensMock });

      const result = await authController.refreshToken(refreshTokenDto);

      expect(authService.refreshAuth.calledWith(refreshTokenDto.refreshToken)).to.be.true;
      expect(result).to.deep.equal({ access: accessTokensMock, refresh: refreshTokensMock });
    });
  });

  describe('forgotPassword', () => {
    it('should send reset token to reset the password', async () => {
      const forgotPasswordDto = new ForgotPasswordDto();
      forgotPasswordDto.emailAddress = 'adi@example.com';

      const resetToken = TOKEN;

      tokenService.generateResetPasswordToken.resolves(resetToken);

      const result = await authController.forgotPassword(forgotPasswordDto);

      expect(tokenService.generateResetPasswordToken.calledWith(forgotPasswordDto.emailAddress)).to.be.true;
      expect(result).to.deep.equal({ token: resetToken });
    });
  });

  describe('resetPassword', () => {
    it('should reset user password', async () => {
      const resetPasswordDto = new ResetPasswordDto();
      resetPasswordDto.token = TOKEN;
      resetPasswordDto.password = 'new-password';

      authService.resetPassword.resolves();

      const result = await authController.resetPassword(resetPasswordDto);

      expect(authService.resetPassword.calledWith(resetPasswordDto.token, resetPasswordDto.password)).to.be.true;
      expect(result).to.deep.equal({ message: 'password successfully updated' });
    });
  });

  after(() => {
    sinon.restore();
  });
});
