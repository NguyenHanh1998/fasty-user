import { HttpException, HttpStatus } from '@nestjs/common';

export class Causes {
  /**
   * common
   */
  public static INTERNAL_ERROR = new HttpException(
    'Server internal error',
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
  public static EMAIL_OR_PASSWORD_INVALID = new HttpException(
    'Email or Password is invalid',
    HttpStatus.UNAUTHORIZED,
  );
  public static DUPLICATED_EMAIL_OR_USERNAME = new HttpException(
    'Email or username was registered',
    HttpStatus.CONFLICT,
  );
  public static IPAGINATION_OPTIONS_INVALID = new HttpException(
    'Page and limit have to greater than 0.',
    HttpStatus.BAD_REQUEST,
  );
  public static BODY_FIELDS_WRONG = new HttpException('Body fields wrong', HttpStatus.BAD_REQUEST);

  public static CURRENCY_INVALID = new HttpException(
    'Currency is not valid in system',
    HttpStatus.BAD_REQUEST,
  );

  public static CURRENCY_INIT_FAIL = new HttpException(
    'Currency init process was failed',
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
  public static CAN_NOT_FOUND_ANY_CRAWL_STATUS_RECORD = new HttpException(
    'Cnnot found any crawl status record',
    HttpStatus.INTERNAL_SERVER_ERROR,
  );

  /**
   * address
   */
  public static ADDRESS_NOT_FOUND = new HttpException('Address not found', HttpStatus.NOT_FOUND);
  public static ADDRESS_NOT_BELONG_TO_WALLET = new HttpException(
    'Address does not belong to wallet',
    HttpStatus.BAD_REQUEST,
  );
  public static CREATE_ADDRESS_FAILED = new HttpException(
    'Create address failed',
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
  public static ENCRYPT_PRIVATE_KEY_ERROR = new HttpException(
    'Encrypted private key invalid',
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
  public static ADDRESS_INSIDE_SYSTEM = new HttpException(
    'Address is inside the system',
    HttpStatus.BAD_REQUEST,
  );
  public static ADDRESS_INVALID = new HttpException('Address invalid', HttpStatus.BAD_REQUEST);
  public static ADDRESS_NEED_MEMO = new HttpException(
    'Memo is required for the address',
    HttpStatus.BAD_REQUEST,
  );
  public static ADDRESS_OF_USER_NOT_FOUND = new HttpException(
    'Address of user not found',
    HttpStatus.INTERNAL_SERVER_ERROR,
  );

  /**
   * wallet
   */
  public static WALLET_NOT_FOUND = new HttpException('Wallet not found', HttpStatus.NOT_FOUND);
  public static MISMATCH_WALLET_COIN_TYPE = new HttpException(
    'msg_coin_type_incorrect',
    HttpStatus.BAD_REQUEST,
  );
  public static WALLET_WITH_CURRENCY_EXISTED = new HttpException(
    'Wallet with currency existed',
    HttpStatus.BAD_REQUEST,
  );
  public static WALLET_WITH_USER_ID_EXISTED = new HttpException(
    'Wallet with user id existed',
    HttpStatus.BAD_REQUEST,
  );
  public static WALLET_WITH_USER_ID_NOT_EXISTED = new HttpException(
    'Wallet with user id is not existed',
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
  /**
   * hot wallet
   */
  public static HOT_WALLET_NOT_FOUND = new HttpException(
    'Hot wallet not found',
    HttpStatus.NOT_FOUND,
  );
  public static HOT_WALLET_EXISTED = new HttpException(
    'Hot wallet of user existed',
    HttpStatus.BAD_REQUEST,
  );
  public static HOT_WALLET_TYPE_INVALID = new HttpException(
    'Hot wallet type is not invalid',
    HttpStatus.BAD_REQUEST,
  );
  public static LOWER_THRESHOLD_MUST_BE_GREATER_THAN_0 = new HttpException(
    'Lower threshold must be greater than 0',
    HttpStatus.BAD_REQUEST,
  );
  public static LOWER_THRESHOLD_MUST_BE_LESS_THAN_UPPER_MIDDLE = new HttpException(
    'Lower threshold must be less than upper threshold and middle threshold',
    HttpStatus.BAD_REQUEST,
  );
  public static MIDDLE_THRESHOLD_MUST_BE_LESS_THAN_UPPER = new HttpException(
    'Middle threshold must be less than upper threshold',
    HttpStatus.BAD_REQUEST,
  );
  /**
   * kms
   **/
  public static KMS_DATA_KEY_NOT_FOUND = new HttpException(
    'msg_kms_data_key_not_found',
    HttpStatus.NOT_FOUND,
  );
  public static KMS_CMK_NOT_FOUND = new HttpException(
    'msg_kms_cmk_not_found',
    HttpStatus.NOT_FOUND,
  );
  public static KMS_CMK_INVALID = new HttpException(
    'msg_kms_cmk_invalid',
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
  public static ONLY_SUPPORT_STRING = new HttpException(
    'msg_only_support_encrypt_string',
    HttpStatus.BAD_REQUEST,
  );

  /**
   * blockchain
   */
  public static GET_BALANCE_FAIL = new HttpException(
    'Get balance fail',
    HttpStatus.INTERNAL_SERVER_ERROR,
  );

  /**
   * deposit
   */
  public static DEPOSIT_AMOUNT_GREATER_THAN_BALANCE = new HttpException(
    'Deposit amount is greater than address balance',
    HttpStatus.BAD_REQUEST,
  );
  public static DEPOSIT_NOT_FOUND = new HttpException('Deposit not found', HttpStatus.NOT_FOUND);
  public static LOCAL_TX_NOT_INSERTED_AFTER_COLLECTING = new HttpException(
    'Local tx not inserted after collecting',
    HttpStatus.INTERNAL_SERVER_ERROR,
  );

  /**
   * withdrawals
   */
  public static WITHDRAW_FROM_INTERNAL_ADDRESS = new HttpException(
    'Cannot withdraw to an address inside the system',
    HttpStatus.BAD_REQUEST,
  );
  public static WALLET_BALANCE_NOT_FOUND_COIN = new HttpException(
    'Wallet balance not found, hot wallet need platform coin to send token.',
    HttpStatus.NOT_FOUND,
  );
  public static WITHDRAWAL_AMOUNT_MUST_GREATER_THAN_ZERO = new HttpException(
    'Withdrawal amount must greater than 0',
    HttpStatus.BAD_REQUEST,
  );

  /**
   * webhook
   **/
  public static WEBHOOK_NOT_FOUND = new HttpException('Webhook not found.', HttpStatus.NOT_FOUND);
  public static WEBHOOK_ALREADY_EXIST = new HttpException(
    'Webhook already exist.',
    HttpStatus.BAD_REQUEST,
  );

  /**
   * crate
   */
  public static CRATE_NOT_FOUND = new HttpException('Crate not found', HttpStatus.NOT_FOUND);

  public static CRATE_INVALID = new HttpException('Crate is not valid', HttpStatus.BAD_REQUEST);

  /**
   * subscription
   */
  public static SUBSCRIPTION_NOT_FOUND = new HttpException(
    'Subscription not found',
    HttpStatus.NOT_FOUND,
  );

  public static SUBSCRIPTION_WITH_CRATE_EXISTED = new HttpException(
    'Subscription with crate id existed',
    HttpStatus.BAD_REQUEST,
  );

  /**
   * product
   */
  public static PRODUCT_NOT_FOUND = new HttpException('Product not found', HttpStatus.NOT_FOUND);

  /**
   * Order
   */
  public static BUYER_CAN_NOT_BE_OWNER = new HttpException(
    'Buyer can not be owner',
    HttpStatus.BAD_REQUEST,
  );
  public static TO_ADDRESS_HAVE_TO_GK_CONTRACT = new HttpException(
    'To address have to gk contract',
    HttpStatus.BAD_REQUEST,
  );
  public static ORDER_NOT_SUPPORT_CURRENCY = new HttpException(
    'Order not support currency',
    HttpStatus.BAD_REQUEST,
  );
  public static ORDER_CREATED = new HttpException('Order created', HttpStatus.BAD_GATEWAY);

  public static PRODUCT_ID_REQUIRED = new HttpException(
    'Product id required',
    HttpStatus.BAD_REQUEST,
  );
  public static PRODUCT_HAVE_MANY_OWNER = new HttpException(
    'Product have many owner',
    HttpStatus.BAD_GATEWAY,
  );
  public static SELLER_IS_NOT_OWNERSHIP = new HttpException(
    'Seller is not ownership',
    HttpStatus.BAD_REQUEST,
  );
  public static PRODUCT_PROCESSING = new HttpException(
    'Product is processing',
    HttpStatus.BAD_REQUEST,
  );
  public static ORDER_UNAVAILABLE = new HttpException('Order unvailable', HttpStatus.BAD_REQUEST);
  public static ORDER_UNAUTHORIZED = new HttpException(
    'Order unauthorized',
    HttpStatus.BAD_REQUEST,
  );
  public static ORDER_NOT_FOUND = new HttpException('Order not found', HttpStatus.NOT_FOUND);
  public static RAWTX_INVALID = new HttpException('Rawtx invalid', HttpStatus.BAD_REQUEST);
  public static CAN_NOT_GET_RAW_TRANSACTION = new HttpException(
    'Cannot get raw transaction',
    HttpStatus.INTERNAL_SERVER_ERROR,
  );

  /**
   * currency config
   */
  public static ADMIN_CURRENCY_NOT_FOUND = new HttpException(
    'Admin currency not found',
    HttpStatus.INTERNAL_SERVER_ERROR,
  );

  /**
   * environment config
   */
  public static ADMIN_ADDRESS_NOT_FOUND = new HttpException(
    'Admin address not found',
    HttpStatus.INTERNAL_SERVER_ERROR,
  );
}
