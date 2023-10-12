import User from '@models/users.model';

import { fakerData } from './faker';
import { IUser } from '@commons/interfaces/user.interface';

export async function userFactory(user: Partial<IUser> = {}) {
  return User.create({
    emailAddress: fakerData.internet.emailAddress(),
    username: fakerData.internet.userName(),
    password: fakerData.internet.password(),
    accountNumber: fakerData.internet.accountNumber(),
    identityNumber: fakerData.internet.identityNumber(),
    ...user,
  });
}
