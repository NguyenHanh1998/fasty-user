import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Causes } from 'src/config/exception/causes';
import { PaginationResponse } from 'src/config/rest/paginationResponse';
import { Product } from 'src/database/entities';
import { logger } from 'src/shared/logger';
import { checkIPaginationOptions, getArrayPagination } from 'src/shared/Utils';
import { Not, Raw, Repository } from 'typeorm';
import { ProductDetails } from './response/productDetails.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,
  ) {}

  async getAllProducts(
    searchOptions: any,
    paginationOptions: IPaginationOptions,
  ): Promise<PaginationResponse<ProductDetails>> {
    if (!checkIPaginationOptions(paginationOptions)) {
      throw Causes.IPAGINATION_OPTIONS_INVALID;
    }

    for (const i in searchOptions) {
      if (!searchOptions[i]) {
        searchOptions[i] = null;
      }
    }
    const { slug, type } = searchOptions;

    const products = await this.productsRepository.find({
      where: {
        type: Raw((alias) => `(:type is null or ${alias} = :type)`, { type }),
        slug: Raw((alias) => `(:slug is null or ${alias} = :slug)`, { slug }),
      },
      order: {
        id: 'DESC',
      },
    });

    const paginatedResult = getArrayPagination(products, paginationOptions);

    const result: Array<ProductDetails> = paginatedResult.items.map((product: Product) => {
      return new ProductDetails(product);
    });

    return {
      results: result,
      pagination: paginatedResult.meta,
    };
  }

  async getRelatedProducts(productId: number): Promise<Array<ProductDetails>> {
    const products = await this.productsRepository.find({
      where: {
        id: Not(productId),
      },
      take: 5,
    });

    const result = products.map((product) => {
      return new ProductDetails(product);
    });

    return result;
  }

  async getProductDetails(productId: number): Promise<ProductDetails> {
    const product = await this.productsRepository.findOne({
      id: productId,
    });

    if (!product) {
      throw Causes.PRODUCT_NOT_FOUND;
    }

    return new ProductDetails(product);
  }
}
