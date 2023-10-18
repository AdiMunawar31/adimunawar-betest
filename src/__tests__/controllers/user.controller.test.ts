import { IUser } from '@commons/interfaces/user.interface';
import { UserControllerV1 } from '@controllers/v1';
import { expect } from 'chai';
import sinon from 'sinon';

describe('UserController', () => {
  let userController: any;
  let userService: any;

  before(() => {
    userService = {
      findAll: sinon.stub(),
      getUserByAccountNumber: sinon.stub(),
      getUserByIdentityNumber: sinon.stub(),
      updateById: sinon.stub(),
      deleteById: sinon.stub(),
    };

    userController = new UserControllerV1();
    userController['userService'] = userService;
  });

  after(() => {
    sinon.restore();
  });

  it('should get all users', async () => {
    const usersMock: IUser[] = [
      {
        userName: 'D2Y',
        emailAddress: 'adi@gmail.com',
        password: 'Test123',
        identityNumber: '0987654321654321',
        accountNumber: '1234567890',
        isEmailVerified: false,
        createdAt: new Date('2023-10-12T13:23:51.910Z'),
        updatedAt: new Date('2023-10-13T09:02:24.235Z'),
      },
    ];
    userService.findAll.resolves(usersMock);

    const result = await userController.getAllUsers(null, null);

    expect(userService.findAll.called).to.be.true;
    expect(result).to.deep.equal({
      status: 'success',
      data: usersMock,
    });
  });

  it('should get a user by accountNumber', async () => {
    const accountNumber = '1234567890';
    const userMock: IUser = {
      userName: 'D2Y',
      emailAddress: 'adi@gmail.com',
      password: 'Test123',
      identityNumber: '0987654321654321',
      accountNumber: '1234567890',
      isEmailVerified: false,
      createdAt: new Date('2023-10-12T13:23:51.910Z'),
      updatedAt: new Date('2023-10-13T09:02:24.235Z'),
    };
    userService.getUserByAccountNumber.resolves(userMock);

    const result = await userController.getUserByAccountNumber(accountNumber);

    expect(userService.getUserByAccountNumber.calledWith(accountNumber)).to.be.true;
    expect(result).to.deep.equal({
      status: 'success',
      data: userMock,
    });
  });

  it('should get a user by identityNumber', async () => {
    const identityNumber = '0987654321654321';
    const userMock: IUser = {
      userName: 'D2Y',
      emailAddress: 'adi@gmail.com',
      password: 'Test123',
      identityNumber: '0987654321654321',
      accountNumber: '1234567890',
      isEmailVerified: false,
      createdAt: new Date('2023-10-12T13:23:51.910Z'),
      updatedAt: new Date('2023-10-13T09:02:24.235Z'),
    };
    userService.getUserByIdentityNumber.resolves(userMock);

    const result = await userController.getUserByIdentityNumber(identityNumber);

    expect(userService.getUserByIdentityNumber.calledWith(identityNumber)).to.be.true;
    expect(result).to.deep.equal({
      status: 'success',
      data: userMock,
    });
  });

  it('should update a user by ID', async () => {
    const userId = '652e1a84386b280062103600';
    const updateBody = { userName: 'adi' };
    const userMock: IUser = {
      userName: 'D2Y',
      emailAddress: 'adi@gmail.com',
      password: 'Test123',
      identityNumber: '0987654321654321',
      accountNumber: '1234567890',
      isEmailVerified: false,
      createdAt: new Date('2023-10-12T13:23:51.910Z'),
      updatedAt: new Date('2023-10-13T09:02:24.235Z'),
    };
    userService.updateById.resolves(userMock);

    const result = await userController.updateUserById(userId, updateBody);

    expect(userService.updateById.calledWith(userId, updateBody)).to.be.true;
    expect(result).to.deep.equal({
      status: 'success',
      message: 'User Updated Successful',
      data: userMock,
    });
  });

  it('should delete a user by ID', async () => {
    const userId = '652e1a84386b280062103600';
    const userMock: IUser = {
      userName: 'D2Y',
      emailAddress: 'adi@gmail.com',
      password: 'Test123',
      identityNumber: '0987654321654321',
      accountNumber: '1234567890',
      isEmailVerified: false,
      createdAt: new Date('2023-10-12T13:23:51.910Z'),
      updatedAt: new Date('2023-10-13T09:02:24.235Z'),
    };
    userService.deleteById.resolves(userMock);

    const result = await userController.deleteUserById(userId);

    expect(userService.deleteById.calledWith(userId)).to.be.true;
    expect(result).to.deep.equal({
      status: 'success',
      message: 'User Deleted Successful',
      data: userMock,
    });
  });
});
