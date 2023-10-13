import { ObjectId } from 'mongoose';
import { Body, Delete, Get, JsonController, Param, Put, QueryParam, UseBefore } from 'routing-controllers';
import { OpenAPI, ResponseSchema } from 'routing-controllers-openapi';

import { IUser } from '@commons/interfaces/user.interface';
import auth from '@middlewares/auth.middleware';
import { UserService } from '@services/v1';

@JsonController('/v1/users', { transformResponse: false })
export class UserController {
  private readonly userService = new UserService();

  @Get('/')
  @OpenAPI({ summary: 'Get users' })
  @ResponseSchema(IUser, { isArray: true })
  @UseBefore(auth())
  async getAllUsers(@QueryParam('limit') limit: string | null, @QueryParam('page') page: string | null) {
    let users: any;
    if (limit !== null && limit !== '' && page !== null && page !== '') {
      users = await this.userService.findAll(parseInt(limit), parseInt(page));
    } else {
      users = await this.userService.findAll();
    }

    return {
      status: 'success',
      data: users,
    };
  }

  @Get('/by-accountNumber/:accountNumber')
  @OpenAPI({ summary: 'Get user by accountNumber' })
  @ResponseSchema(IUser, { isArray: false })
  @UseBefore(auth())
  async getUserByAccountNumber(@Param('accountNumber') accountNumber: string) {
    const user = await this.userService.getUserByAccountNumber(accountNumber);
    return {
      status: 'success',
      data: user,
    };
  }

  @Get('/by-identityNumber/:identityNumber')
  @OpenAPI({ summary: 'Get user by identityNumber' })
  @ResponseSchema(IUser, { isArray: false })
  @UseBefore(auth())
  async getUserByIdentityNumber(@Param('identityNumber') identityNumber: string) {
    const user = await this.userService.getUserByIdentityNumber(identityNumber);
    return {
      status: 'success',
      data: user,
    };
  }

  @Put('/:id')
  @OpenAPI({ summary: 'Update user by ID' })
  @ResponseSchema(IUser, { isArray: false })
  @UseBefore(auth())
  async updateUserById(@Param('id') id: string, @Body() updateBody: Partial<IUser>) {
    const user = await this.userService.updateById(id, updateBody);
    return {
      status: 'success',
      message: 'User Updated Successful',
      data: user,
    };
  }

  @Delete('/:id')
  @OpenAPI({ summary: 'Delete user by ID' })
  @ResponseSchema(IUser, { isArray: false })
  @UseBefore(auth())
  async deleteUserById(@Param('id') id: string) {
    const user = await this.userService.deleteById(id);
    return {
      status: 'success',
      message: 'User Deleted Successful',
      data: user,
    };
  }
}
