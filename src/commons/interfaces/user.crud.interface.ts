import { LeanDocument, ObjectId } from 'mongoose';

export default interface CRUD<T> {
  findAll: (
    limit: number,
    page: number,
  ) => Promise<{
    users: Array<T> | Array<LeanDocument<T>>;
    meta: {
      totalDocs: number;
      totalPages: number;
      page: number;
    };
  }>;
  getById: (id: string) => Promise<T | null>;
  updateById: (id: string, updateBody: Partial<T>) => Promise<T | null>;
  deleteById: (id: string) => Promise<T | null>;
  getUserByAccountNumber: (accountNumber: string) => Promise<T>;
  getUserByIdentityNumber: (identityNumber: string) => Promise<T>;
}
