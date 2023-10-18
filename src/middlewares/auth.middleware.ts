import { IUser } from '@commons/interfaces/user.interface';
import { NextFunction, Request, Response } from 'express';
import passport from 'passport';
import { UnauthorizedError } from 'routing-controllers';

const verifyCallback = (req: Request, resolve: Function, reject: Function) => async (err: Error | null, user: IUser | undefined, info: any) => {
  if (err || info || !user) {
    return reject(new UnauthorizedError('Access Denied: You must be logged in to access this page or resource'));
  }
  req.user = user;

  resolve();
};

const auth = () => async (req: Request, res: Response, next: NextFunction) => {
  return new Promise((resolve, reject) => {
    passport.authenticate('jwt', { session: false }, verifyCallback(req, resolve, reject))(req, res, next);
  })
    .then(() => next())
    .catch(err => next(err));
};

export default auth;
