import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as redis from 'redis';
import { encrypt } from '../../shared/Utils';
import { bool } from 'aws-sdk/clients/signer';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  async canActivate(context: ExecutionContext) {
    await super.canActivate(context);

    return new Promise<bool>(async (resolve) => {
      const req = context.switchToHttp().getRequest();
      const headers = req.headers;
      const token = headers.authorization ? headers.authorization : '';
      if (!token) {
        return resolve(false);
      }

      const client = redis.createClient({
        host: process.env.REDIS_HOST || 'localhost',
        port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
      });

      // token without Bearer
      client.get(`is_validate_${encrypt(token.split(' ')[1])}`, function (err, data) {
        if (data == '0') {
          return resolve(false);
        }
        return resolve(true);
      });
    });
  }
}
