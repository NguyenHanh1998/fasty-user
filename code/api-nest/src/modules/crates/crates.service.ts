import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { Causes } from 'src/config/exception/causes';
import { PaginationResponse } from 'src/config/rest/paginationResponse';
import { Crate } from 'src/database/entities';
import { getArrayPagination } from 'src/shared/Utils';
import { Repository } from 'typeorm';
import { CrateDetails } from './response/crate.dto';

@Injectable()
export class CratesService {
  constructor(
    @InjectRepository(Crate)
    private cratesRepository: Repository<Crate>,
  ) {}

  async getAllCrates(
    paginationOptions: IPaginationOptions,
  ): Promise<PaginationResponse<CrateDetails>> {
    const crates: Array<Crate> = await this.cratesRepository.find({
      order: {
        id: 'ASC',
      },
    });

    const paginatedCrates: Pagination<Crate> = getArrayPagination(crates, paginationOptions);

    return {
      results: paginatedCrates.items,
      pagination: paginatedCrates.meta,
    };
  }

  async getCrateDetails(crateId: number): Promise<CrateDetails> {
    const crate: Crate = await this.cratesRepository.findOne({
      id: crateId,
    });

    if (!crate) {
      throw Causes.CRATE_NOT_FOUND;
    }

    return new CrateDetails(crate);
  }
}
