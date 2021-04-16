import { Body, Controller, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
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
    operationId: 'createANewAddress',
    summary: 'Create a new address',
    description: 'Create a new address',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'SUccessful',
    type: CreateAddressBase,
  })
  async createNewAddress(
    @Body() data: CreateAddressRequest,
    @UserDecorator() user: User,
  ): Promise<CreateAddress> {
    return this.addressesService.createNewAddress(data, user);
  }
}
