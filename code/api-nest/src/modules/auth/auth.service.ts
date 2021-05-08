import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Login } from './request/login.dto';
import { LoginResponse, UserDetails } from './response/login.dto';
import * as argon2 from 'argon2';
import * as redis from 'redis';
import { encrypt } from '../../shared/Utils';
import { Address, EnvConfig, User, Wallet, WalletBalance } from '../../database/entities';
import { InjectRepository } from '@nestjs/typeorm';
import { getConnection, Repository } from 'typeorm';
import { Register } from './request/register.dto';
import { Causes } from 'src/config/exception/causes';
import { UserRole, WithdrawalMode } from 'src/shared/enums';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,

    @InjectRepository(Wallet)
    private walletsRepository: Repository<Wallet>,

    @InjectRepository(Address)
    private addressesRepository: Repository<Address>,

    @InjectRepository(WalletBalance)
    private walletBalancesRepository: Repository<WalletBalance>,

    @InjectRepository(User)
    private usersRepository: Repository<User>,

    @InjectRepository(EnvConfig)
    private envConfigRepository: Repository<EnvConfig>,
  ) {}
  //login
  async validateUser(data: Login, isAdmin: boolean): Promise<any> {
    const user = await this.getUserByEmail(data.email);
    if (user) {
      if (isAdmin && user.role !== UserRole.ADMIN) {
        return null;
      }
      //verify hashed password and plain-password
      const isPassword = await argon2.verify(user.password, data.password);
      if (isPassword) {
        const { password, ...result } = user;
        return result;
      }
    }
    return null;
  }

  async login(user: User, isAdmin: boolean): Promise<LoginResponse> {
    const payload = { username: user.username, userId: user.id };
    const token = this.jwtService.sign(payload);

    const client = redis.createClient({
      host: process.env.REDIS_HOST || 'localhost',
      port: process.env.REDIS_PORT ? parseInt(process.env.REDIS_PORT, 10) : 6379,
    });
    client.set(`is_validate_${encrypt(token)}`, '1');

    // return address with walletid of user
    let address: string = null;
    if (!isAdmin) {
      //get wallet id
      const wallet = await this.walletsRepository.findOne({ userId: user.id });
      if (!wallet) {
        throw Causes.WALLET_WITH_USER_ID_NOT_EXISTED;
      }

      // get address
      const addressRecord = await this.addressesRepository.findOne({
        walletId: wallet.id,
        isOperator: false,
      });
      if (addressRecord) {
        address = addressRecord.address;
      }
    } else {
      // admin
      const envConfig = await this.envConfigRepository.findOne({ key: 'ADMIN_ADDRESS' });
      if (!envConfig) {
        throw Causes.ADMIN_ADDRESS_NOT_FOUND;
      }
      address = envConfig.value;
    }

    return {
      user: new UserDetails(user),
      address,
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

    //create wallet
    const walletId = await this.createWallet(user.id);
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      walletId,
    };
  }

  async createWallet(userId: number) {
    const existedWallet = await this.walletsRepository.find({ userId });
    if (existedWallet.length > 0) {
      throw Causes.WALLET_WITH_USER_ID_EXISTED;
    }
    let walletId = null;
    // insert wallet & wallet-balance
    await getConnection().transaction(async (manager) => {
      const wallet = this.walletsRepository.create({
        userId,
        label: 'eth-wallet',
        currency: 'eth',
        withdrawalMode: WithdrawalMode.NORMAL,
      });
      await manager.save(wallet);
      walletId = wallet.id;

      const walletBalance = this.walletBalancesRepository.create({
        walletId: wallet.id,
        currency: 'eth',
      });
      await manager.save(walletBalance);
    });
    return walletId;
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
