import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { add } from 'lodash';
import { Causes } from 'src/config/exception/causes';
import { Address, User, Wallet } from 'src/database/entities';
import { Currency } from 'src/shared/enums';
import { Repository } from 'typeorm';
import { CreateAddressRequest } from './request/createAddress.dto';
import { CreateAddress } from './response/createAddress.dto';

@Injectable()
export class AddressesService {
  constructor(
    @InjectRepository(Wallet)
    private walletsRepository: Repository<Wallet>,

    @InjectRepository(Address)
    private addressesRepository: Repository<Address>,
  ) {}

  async createNewAddress(data: CreateAddressRequest, user: User): Promise<CreateAddress> {
    const { privateKey, address } = data;
    //get wallet
    const wallet = await this.walletsRepository.findOne({ userId: user.id });

    if (!wallet) {
      throw Causes.WALLET_WITH_USER_ID_NOT_EXISTED;
    }

    //insert address
    let addressRecord = new Address();
    addressRecord.walletId = wallet.id;
    addressRecord.currency = Currency.ETH;
    addressRecord.address = address;
    addressRecord.secret = privateKey;
    addressRecord.userId = user.id;

    addressRecord = await this.addressesRepository.save(addressRecord);
    return new CreateAddress(addressRecord);
  }

  async getOneAddress(user: User): Promise<CreateAddress> {
    const wallet = await this.walletsRepository.findOne({ userId: user.id });
    if (!wallet) {
      throw Causes.WALLET_WITH_USER_ID_NOT_EXISTED;
    }

    const address = await this.addressesRepository.findOne({
      walletId: wallet.id,
      isOperator: false,
    });
    if (!address) {
      throw Causes.ADDRESS_NOT_FOUND;
    }
    return new CreateAddress(address);
  }
}
