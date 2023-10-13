import request from 'supertest';
import { UserControllerV1 } from '@controllers/v1';
import express, { Express } from 'express';

describe('UserController', () => {
  let app: any;

  beforeAll(() => {
    app = express();
    app.use('/api', UserControllerV1);
  });

  describe('GET /api/v1/users', () => {
    it('should get all users', async () => {
      const response = await request(app).get('/v1/users');
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
    });
  });

  describe('GET /v1/users/by-accountNumber/:accountNumber', () => {
    it('should get a user by accountNumber', async () => {
      const accountNumber = '1234567890';
      const response = await request(app).get(`/v1/users/by-accountNumber/${accountNumber}`);
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
    });
  });

  describe('GET /v1/users/by-identityNumber/:identityNumber', () => {
    it('should get a user by identityNumber', async () => {
      const identityNumber = 'your_identity_number_here';
      const response = await request(app).get(`/v1/users/by-identityNumber/${identityNumber}`);
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
    });
  });

  describe('PUT /v1/users/:id', () => {
    it('should update a user by ID', async () => {
      const userId = 'your_user_id_here';
      const updateData = { name: 'Updated Name' };
      const response = await request(app).put(`/v1/users/${userId}`).send(updateData);
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
    });
  });

  describe('DELETE /v1/users/:id', () => {
    it('should delete a user by ID', async () => {
      const userId = 'your_user_id_here'; // Replace with a valid user ID
      const response = await request(app).delete(`/v1/users/${userId}`);
      expect(response.status).toBe(200);
      expect(response.body.status).toBe('success');
    });
  });
});
