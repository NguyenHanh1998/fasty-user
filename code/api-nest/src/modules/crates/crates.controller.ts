import { Controller, Get, HttpStatus, Param, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { PaginationResponse } from 'src/config/rest/paginationResponse';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CratesService } from './crates.service';
import { CrateDetails } from './response/crate.dto';
import { CrateResponseBase } from './response/crateBase.dto';
import { CratesResponseBase } from './response/cratesBase.dto';

@Controller('crates')
@UseGuards(JwtAuthGuard)
export class CratesController {
  constructor(private readonly cratesService: CratesService) {}

  @Get()
  @ApiOperation({
    tags: ['crates'],
    operationId: 'getAllCrates',
    summary: 'Get all crates',
    description: 'Get all crates',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: CratesResponseBase,
  })
  async getAllCrates(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<PaginationResponse<CrateDetails>> {
    return this.cratesService.getAllCrates({ page, limit });
  }

  @Get('/:crate_id')
  @ApiOperation({
    tags: ['crates'],
    operationId: 'getCrateDetails',
    summary: 'Get one crate details',
    description: 'Get one crate details',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: CrateResponseBase,
  })
  async getCrateDetails(@Param('crate_id') crateId: number): Promise<CrateDetails> {
    return this.cratesService.getCrateDetails(crateId);
  }
}
