import RegisterDto from '@dtos/auth/register.dto';
import { UserService } from '@services/v1/user.service';
import { BadRequestError } from 'routing-controllers';

describe('UserService', () => {
  let userService;

  beforeAll(() => {
    userService = new UserService();
  });

  describe('isEmailTaken', () => {
    it('should return true if the email is taken', async () => {
      spyOn(userService.userModel, 'findOne').and.returnValue({ emailAddress: 'user@example.com' });

      const isTaken = await userService.isEmailTaken('user@example.com');

      expect(isTaken).toBe(true);
    });

    it('should return false if the email is not taken', async () => {
      spyOn(userService.userModel, 'findOne').and.returnValue(null);

      const isTaken = await userService.isEmailTaken('newuser@example.com');

      expect(isTaken).toBe(false);
    });
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      spyOn(userService, 'isEmailTaken').and.returnValue(false);
      spyOn(userService.userModel, 'create').and.returnValue({ id: 'new_user_id' });

      const userData = new RegisterDto();
      const newUser = await userService.createUser(userData);

      expect(newUser).toEqual({ id: 'new_user_id' });
    });

    it('should throw a BadRequestError if email is already taken', async () => {
      spyOn(userService, 'isEmailTaken').and.returnValue(true);

      const userData = new RegisterDto();

      try {
        await userService.createUser(userData);
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestError);
        expect(error.message).toBe('Email already Taken');
      }
    });
  });
});
