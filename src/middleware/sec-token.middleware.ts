import {
  Injectable,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class SecTokenMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const secToken = req.headers['x-sec-token'] as string;

    if (!secToken) {
      throw new UnauthorizedException('Missing Sec-Token header');
    }

    const now = new Date();
    const yyyy = now.getFullYear();
    const MM = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const expected = `${yyyy}${MM}${dd}`;

    if (secToken !== expected) {
      throw new UnauthorizedException('Invalid Sec-Token');
    }

    next();
  }
}
