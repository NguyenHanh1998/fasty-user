import { Injectable } from '@nestjs/common';

import { Repository, getConnection, EntityManager, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Causes as InternalException } from '../../config/exception/causes';
import { getLogger } from '../../shared/logger';
import { Product, Order, OrderPaymentMethod, OrderTx } from '../../database/entities';
import {
  OrderStatus,
  OrderStatusSmartContract,
  ProductStatus,
  OrderTxStatus,
  OrderTxType,
  Currency as SupportCurrency,
  ContractMethod,
} from '../../shared/enums';
import { CreateOrder } from './request/createOrder.dto';
import { CancelOrder } from './request/cancelOrder.dto';
import { TakeOrderByEth } from './request/takeOrderByEth.dto';
import { UpdateOrder } from './request/updateOrder.dto';
import { Web3Mixin } from '../common/Web3Mixin.service';
import { toChecksumAddress } from 'web3-utils';
import EthereumTx from 'ethereumjs-tx';
import { TransactionByHash } from './response/transactionByHash.dto';

const logger = getLogger('OrdersService');

@Injectable()
export class OrdersService {
  constructor(
    private readonly web3Mixin: Web3Mixin,

    @InjectRepository(Order)
    private readonly ordersRepository: Repository<Order>,

    @InjectRepository(OrderPaymentMethod)
    private readonly orderPaymentMethodsRepository: Repository<OrderPaymentMethod>,

    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,

    @InjectRepository(OrderTx)
    private readonly orderTxsRepository: Repository<OrderTx>,
  ) {}

  /**
   * Tasks of this function:
   * - insert data to order_tx
   * @param data
   */
  async takeOrderByEth(data: TakeOrderByEth) {
    const { orderId, txid } = data;

    const order = await this.checkOrderOpen(orderId);
    await this.validateTxidInOrderTx(txid);

    // TODO: currently, the transaction creates order is confirmed intermediately. so when the call to this API always fail
    // get order status in smart contract
    // const orderSC = await this.web3Mixin.readContract(ContractMethod.READ.GET_ORDER_DETAILS, [orderId]);
    // if (orderSC.status !== OrderStatusSmartContract.OPEN) {
    //   throw InternalException.ORDER_UNAVAILABLE;
    // }
    const buyerAddress = toChecksumAddress((await this.getTransByHashFromFullNode(txid)).from);
    if (buyerAddress === order.sellerAddress) {
      throw InternalException.BUYER_CAN_NOT_BE_OWNER;
    }

    // check to address
    const checkToAddress = await this.checkToAddressWithFTAddress(txid);
    if (!checkToAddress) {
      throw InternalException.TO_ADDRESS_HAVE_TO_GK_CONTRACT;
    }
    const gkContract = toChecksumAddress((await this.getTransByHashFromFullNode(txid)).to);

    const orderPayment = await this.orderPaymentMethodsRepository.findOne({
      orderId,
      currency: SupportCurrency.ETH,
    });
    if (!orderPayment) {
      throw InternalException.ORDER_NOT_SUPPORT_CURRENCY;
    }

    const orderTx = this.orderTxsRepository.create({
      orderId,
      type: OrderTxType.OrderTakeByEth,
      sellerAddress: order.sellerAddress,
      buyerAddress,
      exchangeAddress: gkContract,
      currency: SupportCurrency.ETH,
      txid,
      status: OrderTxStatus.CONFIRMING,
      refTxid: txid,
    });
    await this.orderTxsRepository.save(orderTx);
  }

  /**
   * Tasks of this function:
   * - insert data to order_tx table
   * - insert data to order table
   * - update status of land/land_bundle
   * @param data
   */
  async createOrder(data: CreateOrder) {
    const { orderId, productId, txid, product } = data;
    const orderExist = await this.ordersRepository.findOne(orderId);
    if (orderExist) {
      throw InternalException.ORDER_CREATED;
    }
    //call infura to get rawTx
    const sellerAddress = toChecksumAddress((await this.getTransByHashFromFullNode(txid)).from);

    if (!productId) {
      throw InternalException.PRODUCT_ID_REQUIRED;
    }

    const productCreated = await this.productsRepository.findOne(productId);
    if (!productCreated) {
      throw InternalException.PRODUCT_NOT_FOUND;
    }

    const ownerAddress = await this.getOwnerOfProduct(productId);
    if (!ownerAddress) {
      throw InternalException.PRODUCT_HAVE_MANY_OWNER;
    }
    if (sellerAddress !== toChecksumAddress(ownerAddress)) {
      throw InternalException.SELLER_IS_NOT_OWNERSHIP;
    }

    // check to address
    const checkToAddress = await this.checkToAddressWithFTAddress(txid);
    if (!checkToAddress) {
      throw InternalException.TO_ADDRESS_HAVE_TO_GK_CONTRACT;
    }

    const isProcessing = await this.checkProductProcessing(productId);
    if (isProcessing) {
      throw InternalException.PRODUCT_PROCESSING;
    }

    // TODO: currently, the transaction creates order is confirmed intermediately. so when the call to this API always fail
    // if (this.checkLandBundleOpen(data.isBundle, data.landId, data.landBundleId)) {
    //   throw InternalException.LAND_BUNDLE_ALREADY_OPEN;
    // }

    await getConnection().transaction(async (manager) => {
      const orderTx = this.orderTxsRepository.create({
        orderId,
        type: OrderTxType.OrderCreate,
        sellerAddress,
        exchangeAddress: data.exchangeAddress,
        txid: data.txid,
        status: OrderTxStatus.CONFIRMING,
      });
      await manager.save(orderTx);

      const order = this.ordersRepository.create({
        id: orderId,
        productId,
        buyerAddress: '',
        sellerAddress,
        exchangeAddress: data.exchangeAddress,
        status: OrderStatus.CONFIRMING_CREATE,
      });
      await manager.save(order);

      await Promise.all(
        data.paymentMethods.map(async (paymentMethod) => {
          const paymentMethods = this.orderPaymentMethodsRepository.create({
            orderId,
            currency: paymentMethod.currency,
            amount: paymentMethod.amount,
            isDefault: paymentMethod.isDefault,
          });
          await manager.save(paymentMethods);
        }),
      );

      await manager.update(Product, { id: productId }, product);

      await this.updateProductStatusToConfirming(manager, productId);
    });
  }

  async getTransByHashFromFullNode(txid: string): Promise<TransactionByHash> {
    let rawTransaction = null;
    try {
      rawTransaction = await this.web3Mixin.getTransactionByHash(txid);
      if (!rawTransaction) {
        throw InternalException.CAN_NOT_GET_RAW_TRANSACTION;
      }
    } catch (error) {
      logger.error(`Cannot get raw transaction by hash due to ${error}`);
      return;
    }
    return new TransactionByHash(rawTransaction.data.result);
  }

  /**
   * Tasks of this function:
   * - insert data to order_tx table
   * - update data to order table
   * - update status of land/bundle
   * @param data
   */
  async updateOrder(data: UpdateOrder) {
    const { orderId, txid } = data;
    const type = OrderTxType.OrderUpdate;

    const order = await this.checkOrderOpen(orderId);
    await this.validateTxidInOrderTx(txid);

    const sellerAddress = toChecksumAddress((await this.getTransByHashFromFullNode(txid)).from);
    if (!this.checkOrderOwner(orderId, sellerAddress)) {
      throw InternalException.ORDER_UNAUTHORIZED;
    }

    // check to address
    const checkToAddress = toChecksumAddress((await this.getTransByHashFromFullNode(txid)).to);
    if (!checkToAddress) {
      throw InternalException.TO_ADDRESS_HAVE_TO_GK_CONTRACT;
    }

    // check order status
    const orderSC = await this.web3Mixin.readContract(ContractMethod.READ.GET_ORDER_DETAILS, [
      orderId,
    ]);
    if (orderSC.status !== OrderStatusSmartContract.OPEN) {
      throw InternalException.ORDER_UNAVAILABLE;
    }

    await getConnection().transaction(async (manager) => {
      const orderTx = this.orderTxsRepository.create({
        orderId,
        type,
        txid: data.txid,
        status: OrderTxStatus.CONFIRMING,
      });
      await manager.save(orderTx);

      if (data.paymentMethods.length > 0) {
        await manager.delete(OrderPaymentMethod, { orderId });

        await Promise.all(
          data.paymentMethods.map(async (paymentMethod) => {
            const paymentMethods = this.orderPaymentMethodsRepository.create({
              orderId,
              currency: paymentMethod.currency,
              amount: paymentMethod.amount,
              isDefault: paymentMethod.isDefault,
            });
            await manager.save(paymentMethods);
          }),
        );
      }
      await this.updateProductStatusToConfirming(manager, order.productId);
    });
  }

  /**
   * Tasks of this function:
   * - insert data to order_tx table
   * - update data to order table
   * - update status of land/bundle
   * @param data
   */
  async cancelOrder(data: CancelOrder) {
    const { orderId, txid, rawTx } = data;
    const type = OrderTxType.OrderCancelled;

    await this.checkOrderOpen(orderId);
    await this.validateTxidInOrderTx(txid);

    const sellerAddress = this.getFromAddressOfRawTx(rawTx);
    if (!this.checkOrderOwner(orderId, sellerAddress)) {
      throw InternalException.ORDER_UNAUTHORIZED;
    }

    // check to address
    const checkToAddress = await this.checkToAddressWithFTAddress(txid);
    if (!checkToAddress) {
      throw InternalException.TO_ADDRESS_HAVE_TO_GK_CONTRACT;
    }

    // TODO: currently, the transaction creates order is confirmed intermediately. so when the call to this API always fail
    // check order status
    // const orderSC = await this.web3Mixin.readContract(ContractMethod.READ.GET_ORDER_DETAILS, [orderId]);
    // if (orderSC.status !== OrderStatusSmartContract.OPEN) {
    //   throw InternalException.ORDER_UNAVAILABLE;
    // }

    await getConnection().transaction(async (manager) => {
      const orderTx = this.orderTxsRepository.create({
        orderId,
        type,
        txid: data.txid,
        status: OrderTxStatus.CONFIRMING,
      });
      await manager.save(orderTx);

      const order = await this.ordersRepository.findOne(orderId);
      if (!order) {
        throw InternalException.ORDER_NOT_FOUND;
      }
      await manager.update(Order, { id: orderId }, { status: OrderStatus.CONFIRMING_CANCEL });

      await this.updateProductStatusToConfirming(manager, order.productId);
    });
  }

  /**
   * Update status of land or bundle is confirming
   * @param isBundle
   * @param id: land_id or land_bundle_id
   */
  async updateProductStatusToConfirming(manager: EntityManager, id: number) {
    const productId = id;
    if (!productId) {
      throw InternalException.PRODUCT_ID_REQUIRED;
    }
    const product = await this.productsRepository.findOne({ id: productId });
    if (!product) {
      throw InternalException.PRODUCT_NOT_FOUND;
    }

    await manager.update(Product, { id: productId }, { status: ProductStatus.CONFIRMING });

    if (product.status === ProductStatus.OFFSALE || product.status === ProductStatus.ONSALE) {
      await manager.update(Product, { id: productId }, { status: ProductStatus.CONFIRMING });
    }

    return;
  }

  async validateTxidInOrderTx(txid: string) {
    const orderTx = await this.orderTxsRepository.findOne({
      txid,
    });
    if (orderTx) {
      throw InternalException.BODY_FIELDS_WRONG;
    }
  }

  async checkOrderOpen(orderId: string) {
    const order = await this.ordersRepository.findOne(orderId);
    if (!order) {
      throw InternalException.ORDER_NOT_FOUND;
    }
    if (order.status !== OrderStatus.OPEN) {
      throw InternalException.ORDER_UNAVAILABLE;
    }

    return order;
  }

  async checkOrderOwner(orderId: string, requestAddress: string) {
    const order = await this.ordersRepository.findOne(orderId);
    if (!order) {
      throw InternalException.ORDER_NOT_FOUND;
    }
    if (toChecksumAddress(order.sellerAddress) === toChecksumAddress(requestAddress)) {
      return true;
    }

    return false;
  }

  /**
   * Check Land or Bundle `OPEN`/`ON_SALE` or not:
   * - Get Contract Address
   * - Get Owner Address of land/1 land in bundle
   * - Compare Owner Address and Contract address:
   * If:
   *    - Same => Land/Bundle is Opening/On_sale
   *    - Not same => off_sale
   * @param productId
   */
  async checkProductOpen(productId: number): Promise<boolean> {
    const contractAddress = await this.web3Mixin.getContractAddress();
    const product = await this.productsRepository.findOne(productId);
    if (!product) {
      throw InternalException.PRODUCT_NOT_FOUND;
    }
    const ownerAddress = await this.web3Mixin.readContract(ContractMethod.READ.OWNER_OF, [
      product.id,
    ]);

    return ownerAddress === contractAddress ? true : false;
  }

  async getOwnerOfProduct(productId: number): Promise<string> {
    const product = await this.productsRepository.findOne({
      id: productId,
    });
    return product.currentOwner;
  }

  getFromAddressOfRawTx(rawTx: string): string {
    let finalRawTx: string = rawTx;
    if (!finalRawTx.startsWith('0x')) {
      finalRawTx = '0x' + finalRawTx;
    }
    let sellerAddress = '';
    try {
      sellerAddress = '0x' + new EthereumTx(finalRawTx).getSenderAddress().toString('hex');
    } catch (err) {
      throw InternalException.RAWTX_INVALID;
    }
    return toChecksumAddress(sellerAddress);
  }

  getToAddressOfRawTx(rawTx: string): string {
    let finalRawTx: string = rawTx;
    if (!finalRawTx.startsWith('0x')) {
      finalRawTx = '0x' + finalRawTx;
    }
    let sellerAddress = '';
    try {
      const transaction = new EthereumTx(finalRawTx);
      sellerAddress = '0x' + transaction.to.toString('hex');
    } catch (err) {
      throw InternalException.RAWTX_INVALID;
    }
    return toChecksumAddress(sellerAddress);
  }

  async checkToAddressWithFTAddress(txid: string): Promise<boolean> {
    const toAddress = toChecksumAddress((await this.getTransByHashFromFullNode(txid)).to);
    const contractAddress = await this.web3Mixin.getContractAddress();

    return toAddress === contractAddress;
  }

  /**
   * Check land/bundle is processing or not
   * @param isBundle
   * @param landId
   * @param landBundleId
   */
  async checkProductProcessing(productId: number) {
    const orderProcessing: string[] = [
      OrderStatus.CONFIRMING_CREATE,
      OrderStatus.CONFIRMING_UPDATE,
      OrderStatus.CONFIRMING_CANCEL,
      OrderStatus.OPEN,
      OrderStatus.HOLDING,
    ];

    const orderProduct = await this.ordersRepository.findOne({
      where: {
        productId,
      },
      order: { createdAt: 'DESC' },
    });

    if (!orderProduct) {
      return false;
    }
    // just need to check order for the product is selling or not
    if (orderProcessing.includes(orderProduct.status)) {
      return true;
    }
    return false;
  }
}
