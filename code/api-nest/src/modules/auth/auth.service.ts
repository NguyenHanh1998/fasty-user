import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Login } from './request/login.dto';
import { LoginResponse, UserDetails } from './response/login.dto';
import * as argon2 from 'argon2';
import * as redis from 'redis';
import { encrypt } from '../../shared/Utils';
import { User } from '../../database/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Register } from './request/register.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,

    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  //login
  async validateUser(data: Login): Promise<any> {
    const user = await this.getUserByEmail(data.email);
    if (user) {
      //verify hashed password and plain-password
      const isPassword = await argon2.verify(user.password, data.password);
      if (isPassword) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: User): Promise<LoginResponse> {
    const payload = { username: user.username, userId: user.id };
    const token = this.jwtService.sign(payload);

    const client = redis.createClient({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
    });
    client.set(`is_validate_${encrypt(token)}`, '1');

    return {
      user: new UserDetails(user),
      token,
    };
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.usersRepository.findOne({ email: email });
  }

  //register
  async checkDuplicatedUser(data: Register): Promise<any> {
    //check duplicated username or email
    const duplicatedUser = await this.getUserByEmailAndUsername(data.email, data.username);
    return duplicatedUser;
  }

  async getUserByEmailAndUsername(email: string, username: string): Promise<User | undefined> {
    return (
      (await this.usersRepository.findOne({ username: username })) ||
      (await this.usersRepository.findOne({ email: email }))
    );
  }

  async registerUser(data: Register): Promise<any> {
    //hash password
    const hashedPassword = await argon2.hash(data.password);

    //insert user table
    const user = await this._registerUser(data.email, data.username, hashedPassword);
    return {
      id: user.id,
      email: user.email,
      username: user.username,
    };
  }

  async _registerUser(email: string, username: string, password: string) {
    let user = new User();
    user.email = email;
    user.password = password;
    user.username = username;

    user = await this.usersRepository.save(user);
    return user;
  }

  logout(token: string) {
    const tokenWithoutBearer = token.split(' ')[1];

    const client = redis.createClient({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
    });
    client.set(`is_validate_${encrypt(tokenWithoutBearer)}`, '0');
  }
}
