import supertest, { SuperTest, Test } from 'supertest';

import { clearDB } from '@__tests__/jest/db';
import { fakerData, userFactory } from '@__tests__/jest/factories';
import App from '@app';
import { AuthControllerV1 } from '@controllers/v1';

let server: SuperTest<Test>;
const baseUrl = '/api/v1/auth';

describe('register test suit', () => {
  beforeEach(async () => {
    await clearDB();
    const app = new App([AuthControllerV1]);
    await App.initDB();
    server = supertest(app.getServer());
  });

  test('email is not valid', async () => {
    const newUser = {
      emailAddress: 'notemail',
      username: 'abcabc',
      password: '123123',
      accountNumber: '1234567890',
      identityNumber: '1234567890123456',
    };
    const { body } = await server.post(`${baseUrl}/register`).send(newUser).expect(400);
    expect(body.message).toBe('email must be an email');
  });

  test('username should at least 4 character', async () => {
    const newUser = {
      emailAddress: fakerData.internet.emailAddress(),
      username: 'abc',
      password: '123123',
      accountNumber: '1234567890',
      identityNumber: '1234567890123456',
    };
    const { body } = await server.post(`${baseUrl}/register`).send(newUser).expect(400);
    expect(body.message).toBe('username must be longer than or equal to 4 characters');
  });

  test('password should at least 6 character', async () => {
    const newUser = {
      emailAddress: fakerData.internet.emailAddress(),
      username: 'abcd',
      password: '1231',
      accountNumber: '1234567890',
      identityNumber: '1234567890123456',
    };
    const { body } = await server.post(`${baseUrl}/register`).send(newUser).expect(400);
    expect(body.message).toBe('password must be longer than or equal to 6 characters');
  });

  test('email should be unique', async () => {
    const emailAddress = fakerData.internet.emailAddress();
    await userFactory({ emailAddress });
    const newUser2 = {
      emailAddress: emailAddress,
      username: 'abcd',
      password: '123123',
      accountNumber: '1234567890',
      identityNumber: '1234567890123456',
    };

    const { body } = await server.post(`${baseUrl}/register`).send(newUser2).expect(500);
    expect(body.message).toBe('Email already Taken');
  });

  test('email should be unique', async () => {
    const newUser = {
      emailAddress: fakerData.internet.emailAddress(),
      username: fakerData.internet.userName(),
      password: fakerData.internet.password(),
      accountNumber: '1234567890',
      identityNumber: '1234567890123456',
    };

    const { body } = await server.post(`${baseUrl}/register`).send(newUser).expect(201);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userResult } = newUser;

    expect(body.user).toMatchObject(userResult);
    expect(body.tokens).toBeDefined();
    expect(body.tokens.access.token).toBeDefined();
    expect(body.tokens.refresh.token).toBeDefined();
  });
});
