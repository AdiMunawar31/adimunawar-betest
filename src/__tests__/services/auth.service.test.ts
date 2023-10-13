import { AuthService } from '@services/v1/auth.service'; // Sesuaikan dengan path yang benar

describe('AuthService', () => {
  const authService = new AuthService();

  // Uji metode loginUserWithEmailAndPassword
  describe('loginUserWithEmailAndPassword', () => {
    it('should authenticate a user with valid credentials', async () => {
      const emailAddress = 'valid@example.com';
      const password = 'validpassword';

      const user = await authService.loginUserWithEmailAndPassword(emailAddress, password);

      expect(user).toBeDefined();
    });

    it('should throw UnauthorizedError for invalid credentials', async () => {
      const emailAddress = 'invalid@example.com';
      const password = 'inval';

      try {
        await authService.loginUserWithEmailAndPassword(emailAddress, password);
        expect(true).toBe(false); // Pengujian harus gagal
      } catch (error) {
        expect(error.name).toBe('UnauthorizedError');
        expect(error.message).toBe('Invalid credentials');
      }
    });
  });

  // Uji metode logout
  describe('logout', () => {
    it('should successfully log out a user with a valid refresh token', async () => {
      const refreshToken = 'valid_refresh_token';

      await expect(async () => {
        await authService.logout(refreshToken);
      }).not.toThrow();
    });

    it('should throw NotFoundError for invalid refresh token', async () => {
      const invalidRefreshToken = '';

      try {
        await authService.logout(invalidRefreshToken);
        expect(true).toBe(false); // Pengujian harus gagal
      } catch (error) {
        expect(error.name).toBe('NotFoundError');
        expect(error.message).toBe('Token Not Found');
      }
    });
  });

  // Uji metode resetPassword
  describe('resetPassword', () => {
    it('should reset the user password with a valid reset token', async () => {
      const resetToken = 'valid_reset_token';
      const newPassword = 'newpassword';

      await expect(async () => {
        await authService.resetPassword(resetToken, newPassword);
      }).not.toThrow();
    });

    it('should throw NotFoundError for invalid reset token', async () => {
      const invalidResetToken = 'invalid_reset_token';

      try {
        await authService.resetPassword(invalidResetToken, 'newpassword');
        expect(true).toBe(false); // Pengujian harus gagal
      } catch (error) {
        expect(error.name).toBe('NotFoundError');
        expect(error.message).toBe('Token Not Found');
      }
    });
  });
});
