import { ObjectId } from 'mongoose';
import { BadRequestError, NotFoundError } from 'routing-controllers';
import RedisClient from 'configs/redis';
import CRUD from '@commons/interfaces/user.crud.interface';
import Users from '@models/users.model';
import { IUser, IUserSchema } from '@commons/interfaces/user.interface';
import RegisterDto from '@dtos/auth/register.dto';
import { CONSTANT } from '@commons/constants';

export class UserService implements CRUD<IUserSchema> {
  private readonly userModel = Users;

  async isEmailTaken(emailAddress: string): Promise<boolean> {
    const user = await this.userModel.findOne({ emailAddress });

    return !!user;
  }

  async createUser(userData: RegisterDto) {
    const { emailAddress } = userData;
    if (await this.isEmailTaken(emailAddress)) {
      throw new BadRequestError('Email already Taken');
    }

    const user = await this.userModel.create({ ...userData });
    return user;
  }

  async getUserByEmail(emailAddress: string) {
    return await this.userModel.findOne({ emailAddress });
  }

  async getById(id: ObjectId): Promise<IUserSchema | null> {
    return await this.userModel.findById(id);
  }

  async updateById(id: ObjectId, updateBody: Partial<IUser>): Promise<IUserSchema | null> {
    if (updateBody.emailAddress) {
      delete updateBody.emailAddress;
    }

    const user = await this.getById(id);
    if (!user) {
      throw new BadRequestError('User not found');
    }

    Object.assign(user, updateBody);
    await user.save();
    return user;
  }

  async findAll(limit = 10, page = 0) {
    const cacheKey = `redis_adimunawar_betest`;
    const cachedData: any = await RedisClient.get(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const query = {};
    const totalDocs = await this.userModel.countDocuments(query);
    const docs = await this.userModel
      .find(query)
      .limit(limit)
      .skip(limit * page)
      .sort({ createdAt: -1 })
      .lean();

    const sanitizedDocs = docs.map(doc => {
      const { password, ...rest } = doc;
      return rest;
    });

    const result = {
      users: JSON.parse(JSON.stringify(sanitizedDocs)),
      meta: {
        totalDocs,
        totalPages: Math.ceil(totalDocs / limit) || 0,
        page,
      },
    };

    await RedisClient.set(cacheKey, JSON.stringify(result), CONSTANT.YOUR_EXPIRATION_TIME_IN_SECONDS);

    return result;
  }

  async getUserByAccountNumber(accountNumber: string) {
    const cacheKey = `redis_adimunawar_${accountNumber}_betest`;
    const cachedData = await RedisClient.get(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const user = await this.userModel.findOne({ accountNumber });

    if (!user) {
      throw new NotFoundError('User Not Found');
    }

    await RedisClient.set(cacheKey, JSON.stringify(user), CONSTANT.YOUR_EXPIRATION_TIME_IN_SECONDS);

    return user;
  }

  async getUserByIdentityNumber(identityNumber: string) {
    const cacheKey = `redis_adimunawar_${identityNumber}_betest`;
    const cachedData = await RedisClient.get(cacheKey);

    if (cachedData) {
      return JSON.parse(cachedData);
    }

    const user = await this.userModel.findOne({ identityNumber });

    if (!user) {
      throw new NotFoundError('User Not Found');
    }

    await RedisClient.set(cacheKey, JSON.stringify(user), CONSTANT.YOUR_EXPIRATION_TIME_IN_SECONDS);

    return user;
  }
}
