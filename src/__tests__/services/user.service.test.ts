import RegisterDto from '@dtos/auth/register.dto';
import { expect } from 'chai';
import { BadRequestError } from 'routing-controllers';
import sinon from 'sinon';

import Users from '@models/users.model';
import { UserService } from '@services/v1';

describe('UserService', () => {
  let userService: any;

  beforeEach(() => {
    userService = new UserService();
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('isEmailTaken', () => {
    it('should return true when email is taken', async () => {
      // Stub the findOne method to return a user
      sinon.stub(Users, 'findOne').resolves({});

      const result = await userService.isEmailTaken('test@example.com');

      expect(result).to.be.true;
    });

    it('should return false when email is not taken', async () => {
      // Stub the findOne method to return null (no user found)
      sinon.stub(Users, 'findOne').resolves(null);

      const result = await userService.isEmailTaken('test@example.com');

      expect(result).to.be.false;
    });
  });

  describe('createUser', () => {
    it('should create a user when email is not taken', async () => {
      // Stub the isEmailTaken method to return false (email is not taken)
      sinon.stub(userService, 'isEmailTaken').resolves(false);

      // Stub the Users.create method to return the user data
      const userData = {
        // Fill in with the user data
      };
      sinon.stub(Users, 'create').resolves(userData);

      const result = await userService.createUser(new RegisterDto());

      expect(result).to.deep.equal(userData);
    });

    it('should throw BadRequestError when email is taken', async () => {
      // Stub the isEmailTaken method to return true (email is taken)
      sinon.stub(userService, 'isEmailTaken').resolves(true);

      try {
        await userService.createUser(new RegisterDto());
      } catch (error) {
        expect(error).to.be.an.instanceof(BadRequestError);
        expect(error.message).to.equal('Email already Taken');
      }
    });
  });

  describe('getUserByEmail', () => {
    it('should return a user by email address', async () => {
      // Stub the findOne method to return a user
      sinon.stub(Users, 'findOne').resolves({ emailAddress: 'test@example.com' });

      const result = await userService.getUserByEmail('test@example.com');

      expect(result.emailAddress).to.equal('test@example.com');
    });

    it('should return null when no user is found', async () => {
      // Stub the findOne method to return null (no user found)
      sinon.stub(Users, 'findOne').resolves(null);

      const result = await userService.getUserByEmail('test@example.com');

      expect(result).to.be.null;
    });
  });

  describe('getById', () => {
    it('should return a user by ID', async () => {
      // Stub the findById method to return a user
      sinon.stub(Users, 'findById').resolves({ _id: '123', name: 'John Doe' });

      const result = await userService.getById('123');

      expect(result).to.deep.equal({ _id: '123', name: 'John Doe' });
    });

    it('should return null when no user is found', async () => {
      // Stub the findById method to return null (no user found)
      sinon.stub(Users, 'findById').resolves(null);

      const result = await userService.getById('123');

      expect(result).to.be.null;
    });
  });
  describe('updateById', () => {
    it('should throw BadRequestError when the ID is invalid', async () => {
      const id = 'invalidID';
      const updateBody = { name: 'Updated Name' };

      try {
        await userService.updateById(id, updateBody);
      } catch (error) {
        expect(error).to.be.an.instanceof(BadRequestError);
        expect(error.message).to.equal('Invalid user ID');
      }
    });
  });
});
