import { Body, Controller, Get, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { User } from 'src/database/entities';
import { UserDecorator } from 'src/shared/decorator/user.decorator';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AddressesService } from './addresses.service';
import { CreateAddressRequest } from './request/createAddress.dto';
import { CreateAddress } from './response/createAddress.dto';
import { CreateAddressBase } from './response/createAddressBase.dto';

@Controller('addresses')
@UseGuards(JwtAuthGuard)
export class AddressesController {
  constructor(private readonly addressesService: AddressesService) {}

  @Post('/create')
  @ApiOperation({
    tags: ['addresses'],
    operationId: 'createNewAddress',
    summary: 'Create new address',
    description: 'Create new address',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: CreateAddressBase,
  })
  async createNewAddress(
    @Body() data: CreateAddressRequest,
    @UserDecorator() user: User,
  ): Promise<CreateAddress> {
    return this.addressesService.createNewAddress(data, user);
  }

  @Get('/detail')
  @ApiOperation({
    tags: ['addresses'],
    operationId: 'getOneAddress',
    summary: 'Get one address',
    description: 'Get one address',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: CreateAddressBase,
  })
  async getOneAddress(@UserDecorator() user: User): Promise<CreateAddress> {
    return this.addressesService.getOneAddress(user);
  }
}
