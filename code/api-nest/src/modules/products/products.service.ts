import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Causes } from 'src/config/exception/causes';
import { PaginationResponse } from 'src/config/rest/paginationResponse';
import { Order, Product } from 'src/database/entities';
import { logger } from 'src/shared/logger';
import { checkIPaginationOptions, getArrayPagination } from 'src/shared/Utils';
import { Not, Raw, Repository } from 'typeorm';
import { ProductDetails } from './response/productDetails.dto';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private productsRepository: Repository<Product>,

    @InjectRepository(Order)
    private ordersRepository: Repository<Order>,
  ) {}

  async getAllProducts(
    searchOptions: any,
    paginationOptions: IPaginationOptions,
  ): Promise<PaginationResponse<ProductDetails>> {
    if (!checkIPaginationOptions(paginationOptions)) {
      throw Causes.IPAGINATION_OPTIONS_INVALID;
    }

    for (const i in searchOptions) {
      if (!searchOptions[i] || searchOptions[i] === 'null') {
        searchOptions[i] = null;
      }
    }
    const { slug, key, type, status, gender } = searchOptions;

    const products = await this.productsRepository.find({
      where: {
        type: Raw((alias) => `(:type is null or ${alias} = :type)`, { type }),
        slug: Raw((alias) => `(:slug is null or ${alias} = :slug)`, { slug }),
        name: Raw((alias) => `(:key is null or ${alias} like :search)`, {
          key,
          search: `%${key}%`,
        }),
        status: Raw((alias) => `(:status is null or ${alias} = :status)`, { status }),
        gender: Raw((alias) => `(:gender is null or ${alias} = :gender)`, { gender }),
      },
      order: {
        id: 'DESC',
      },
    });

    const paginatedResult = getArrayPagination(products, paginationOptions);

    const result = await Promise.all(
      paginatedResult.items.map(async (product: any) => {
        const order = await this.ordersRepository.findOne({ productId: product.id });
        product.orderId = order ? order.id : null;
        return new ProductDetails(product);
      }),
    );

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

    const result = await Promise.all(
      products.map(async (product: any) => {
        const order = await this.ordersRepository.findOne({ productId: product.id });
        product.orderId = order ? order.id : null;
        return new ProductDetails(product);
      }),
    );

    return result;
  }

  async getProductDetails(productId: number): Promise<ProductDetails> {
    const product = await this.productsRepository.findOne({
      id: productId,
    });

    if (!product) {
      throw Causes.PRODUCT_NOT_FOUND;
    }

    const formatProduct = new ProductDetails(product);
    const order = await this.ordersRepository.findOne({ productId: product.id });
    formatProduct.orderId = order ? order.id : null;

    return formatProduct;
  }
}
