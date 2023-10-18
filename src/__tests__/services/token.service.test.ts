import { TokenTypes } from '@commons/constants';
import { ITokenSchema } from '@commons/interfaces/token.interface';
import { IUserSchema } from '@commons/interfaces/user.interface';
import { assert, expect } from 'chai';
import jsonwebtoken from 'jsonwebtoken';
import moment from 'moment';
import * as sinon from 'sinon';

import Tokens from '@models/tokens.model';
import { TokenService } from '@services/v1';

import { jwt } from '../../configs';

describe('TokenService', () => {
  let tokenService: TokenService;
  let userService: any;

  before(() => {
    tokenService = new TokenService();
    userService = {
      getUserByEmail: sinon.stub(),
    };
    tokenService['userService'] = userService;
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('generateAuthTokens', () => {
    it('should generate authentication tokens', async () => {
      const fakeUser: Partial<IUserSchema> = {
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

      const createStub = sinon.stub(Tokens, 'create').resolves({});

      userService.getUserByEmail.resolves(fakeUser);

      try {
        const tokens = await tokenService.generateAuthTokens(fakeUser as IUserSchema);

        expect(tokens).to.have.property('access');
        expect(tokens).to.have.property('refresh');
        sinon.assert.calledOnce(createStub);
      } catch (error) {
        throw error;
      }
    });
  });

  describe('generateToken', () => {
    it('should generate a valid JWT token', () => {
      const userId = '12345';
      const expire = moment().add(1, 'hour').unix();
      const type = TokenTypes.ACCESS;
      const token = tokenService.generateToken(userId, expire, type);

      expect(token).to.be.a('string');

      const decoded = jsonwebtoken.verify(token, jwt.secret);
      expect(decoded).to.have.property('sub', userId);
      expect(decoded).to.have.property('exp', expire);
      expect(decoded).to.have.property('type', type);
    });
  });

  describe('saveToken', () => {
    it('should save a token to the database', async () => {
      const token = 'fakeToken';
      const userId = '12345';
      const expires = new Date();
      const type = TokenTypes.RESET_PASSWORD;

      const createStub = sinon.stub(Tokens, 'create').resolves({});
      await tokenService.saveToken(token, userId, expires, type);

      expect(createStub.calledOnce).to.be.true;
      expect(
        createStub.calledWith({
          token,
          userId,
          expires,
          type,
          blacklisted: false,
        }),
      ).to.be.true;
    });
  });

  describe('verifyToken', () => {
    it('should verify a valid token', async () => {
      const fakeToken = 'fakeToken';
      const fakePayload = { sub: '12345' };
      const fakeTokenDoc: Partial<ITokenSchema> = { token: fakeToken, type: TokenTypes.ACCESS, userId: fakePayload.sub, blacklisted: false };

      const verifyStub: sinon.SinonStub = sinon.stub(jsonwebtoken, 'verify');
      verifyStub.withArgs(fakeToken, jwt.secret).returns(fakePayload);

      const findOneStub = sinon.stub(Tokens, 'findOne').resolves(fakeTokenDoc);

      try {
        const tokenDoc = await tokenService.verifyToken(fakeToken, TokenTypes.ACCESS);

        assert.deepEqual(tokenDoc, fakeTokenDoc);
        assert.isTrue(verifyStub.calledOnce);
        assert.isTrue(findOneStub.calledOnce);
      } catch (error) {
        throw error;
      } finally {
        verifyStub.restore();
      }
    });

    it('should throw an error if token is not found', async () => {
      const fakeToken = 'fakeToken';

      const verifyStub: sinon.SinonStub = sinon.stub(jsonwebtoken, 'verify');
      verifyStub.withArgs(fakeToken, jwt.secret).throws(new Error('Token not found'));

      sinon.stub(Tokens, 'findOne').resolves(null);

      try {
        await tokenService.verifyToken(fakeToken, TokenTypes.ACCESS);
      } catch (error) {
        assert.equal(error.message, 'Token not found');
      } finally {
        verifyStub.restore();
      }
    });
  });
});
