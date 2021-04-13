import { Controller, Get, HttpStatus, Param, Query, UseGuards } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiResponse } from '@nestjs/swagger';
import { PaginationResponse } from 'src/config/rest/paginationResponse';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ProductsService } from './products.service';
import { ProductBase } from './response/productBase.dto';
import { ProductDetails } from './response/productDetails.dto';
import { ProductsBase } from './response/productsBase.dto';

@Controller('products')
@UseGuards(JwtAuthGuard)
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Get()
  @ApiOperation({
    tags: ['products'],
    operationId: 'getAllProducts',
    summary: 'Get all products',
    description: 'Get all products',
  })
  @ApiQuery({
    name: 'slug',
    required: false,
    type: String,
  })
  @ApiQuery({
    name: 'type',
    required: false,
    type: Number,
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
    type: ProductsBase,
  })
  async getAllProducts(
    @Query('slug') slug: string,
    @Query('type') type: number,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ): Promise<PaginationResponse<ProductDetails>> {
    return this.productsService.getAllProducts({ slug, type }, { page, limit });
  }

  @Get('/related/:product_id')
  @ApiOperation({
    tags: ['products'],
    operationId: 'getRelatedProducts',
    summary: 'Get related products',
    description: 'Get related products',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: ProductsBase,
  })
  async getRelatedProducts(@Param('product_id') productId: number): Promise<Array<ProductDetails>> {
    return this.productsService.getRelatedProducts(productId);
  }

  @Get('/:product_id')
  @ApiOperation({
    tags: ['products'],
    operationId: 'getOneProductDetails',
    summary: 'Get one product details',
    description: 'Get one product details',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Successful',
    type: ProductBase,
  })
  async getProductDetails(@Param('product_id') productId: number): Promise<ProductDetails> {
    return this.productsService.getProductDetails(productId);
  }
}
