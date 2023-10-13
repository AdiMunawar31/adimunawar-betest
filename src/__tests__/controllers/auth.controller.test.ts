import request from 'supertest';
import { Express } from 'express';
import { createExpressServer } from 'routing-controllers';
import { AuthControllerV1 } from '@controllers/v1'; // Ganti dengan path sesuai dengan struktur proyek Anda

describe('AuthControllerV1', () => {
  let app: Express;

  beforeAll(() => {
    app = createExpressServer({
      controllers: [AuthControllerV1],
    });
  });

  it('should register a new user', async () => {
    const userData = {
      emailAddress: 'testuser@example.com',
      userName: 'testuser',
      password: 'password123',
      accountNumber: '1234567890',
      identityNumber: '1234567890123456',
    };

    const response = await request(app)
      .post('/api/v1/auth/register') // Perubahan path ke "/api/v1/auth/register"
      .send(userData);

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('tokens');
  });

  it('should log in a user', async () => {
    const userData = {
      emailAddress: 'testuser@example.com',
      password: 'password123',
    };

    const response = await request(app)
      .post('/api/v1/auth/login') // Perubahan path ke "/api/v1/auth/login"
      .send(userData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('user');
    expect(response.body).toHaveProperty('tokens');
  });

  it('should log out a user', async () => {
    const userData = {
      refreshToken: 'your_refresh_token_here',
    };

    const response = await request(app)
      .post('/api/v1/auth/logout') // Perubahan path ke "/api/v1/auth/logout"
      .send(userData);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('message', 'logout success');
  });

  // Add more test cases for other controller methods as needed

  // Clean up: Uncomment this if you want to reset data after tests
  /*
  afterAll(() => {
    // Add code to clean up data or close connections here if needed
  });
  */
});
