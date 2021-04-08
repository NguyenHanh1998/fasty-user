export enum HotWalletStatus {
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum Currency {
  BIV = 'biv',
  WBIV = 'wbiv',
  ETH = 'eth',
}

export enum WEBHOOK_TYPE {
  TRANSFER = 'transfer',
  TXCHANGED = 'tx_changed',
  COMMON = 'common',
}

export enum LocalTxType {
  DEPOSIT = 'deposit',
  WITHDRAWAL_NORMAL = 'withdrawal_normal',
  WITHDRAWAL_COLD = 'withdrawal_cold',
  SEED = 'seed',
  COLLECT = 'collect',
  WITHDRAWAL_COLLECT = 'withdrawal_collect',
}

export enum WithdrawalStatus {
  INVALID = 'invalid',
  UNSIGNED = 'unsigned',
  SIGNING = 'signing',
  SIGNED = 'signed',
  SENT = 'sent',
  COMPLETED = 'completed',
  FAILED = 'failed',
}

export enum WithdrawOutType {
  WITHDRAW_OUT_COLD_SUFFIX = '_cold_withdrawal',
  WITHDRAW_OUT_NORMAL = 'normal',
  EXPLICIT_FROM_HOT_WALLET = 'explicit_from_hot_wallet',
  EXPLICIT_FROM_DEPOSIT_ADDRESS = 'explicit_from_deposit_address',
  AUTO_COLLECTED_FROM_DEPOSIT_ADDRESS = 'auto_collected_from_deposit_address',
}

export enum WalletEvent {
  CREATED = 'created',
  DEPOSIT = 'deposit',
  WITHDRAW_REQUEST = 'withdraw_request',
  WITHDRAW_COMPLETED = 'withdraw_completed',
  WITHDRAW_FAILED = 'withdraw_failed',
  WITHDRAW_FEE = 'withdraw_fee',
  WITHDRAW_ACCEPTED = 'withdraw_accepted',
  WITHDRAW_DECLINED = 'withdraw_declined',
  COLLECT_FEE = 'collect_fee',
  COLLECT_AMOUNT = 'collect_amount',
  COLLECTED_FAIL = 'collected_fail',
  COLLECTED = 'collected',
  SEEDED_FAIL = 'seeded_fail',
  SEEDED = 'seeded',
  SEED_FEE = 'seed_fee',
  SEED_AMOUNT = 'seed_amount',
}

export enum CollectStatus {
  UNCOLLECTED = 'uncollected',
  COLLECTING_FORWARDING = 'forwarding',
  COLLECTING = 'collecting',
  COLLECT_SIGNED = 'collect_signed',
  COLLECT_SENT = 'collect_sent',
  COLLECTED = 'collected',
  NOTCOLLECT = 'notcollect',
  SEED_REQUESTED = 'seed_requested',
  SEEDING = 'seeding',
  SEED_SIGNED = 'seed_signed',
  SEED_SENT = 'seed_sent',
  SEEDED = 'seeded',
}

export enum HotWalletType {
  NORMAL = 'normal',
  SEED = 'seed',
}

export enum OrderStatus {
  CREATE_FAILED = 'create_failed',
  CONFIRMING_CREATE = 'confirming_create',
  CONFIRMING_UPDATE = 'confirming_update',
  CONFIRMING_CANCEL = 'confirming_cancel',
  OPEN = 'open',
  HOLDING = 'holding',
  FULFILLED = 'fulfilled',
  CANCELLED = 'cancelled',
}

export enum OrderTxStatus {
  CONFIRMING = 'confirming',
  CONFIRMED = 'confirmed',
  CANCELLED = 'cancelled',
  FAILED = 'failed',
  REFUNDED = 'refunded',
  SUCCESSED = 'successed', // Only use for render
}

export enum ProductStatus {
  CONFIRMING = 'confirming',
  OFFSALE = 'off_sale',
  ONSALE = 'on_sale',
  HOLDING = 'holding',
  SOLD = 'sold',
}

export enum OrderTxType {
  OrderCreate = 'OrderCreate',
  OrderUpdate = 'OrderUpdate',
  OrderCancelled = 'OrderCancelled',
  OrderHolding = 'OrderHolding',
  OrderFulfilled = 'OrderFulfilled',
  OrderTakeByEth = 'OrderTakeByEth',
  OrderTakeByErc20 = 'OrderTakeByErc20',
  Refund = 'Refund',
}

export enum OrderStatusSmartContract {
  OPEN = '0',
  HOLDING = '1',
  FULFILLED = '2',
  CANCELLED = '3',
}

export const ContractMethod = {
  READ: {
    GET_GK_ISSUE_ADDRESS: 'getGKIssueAddress',
    IS_LAND_EXISTED: 'isLandExisted',
    GET_LAND_DETAIL: 'getLandDetail',
    GET_ORDER_GOOD_ID: 'getOrderGoodId',
    GET_ORDER_DETAILS: 'getOrderDetails',
    ON_ERC_721_RECEIVE_: 'onErc721Receive',
    OWNER_OF: 'ownerOf',
  },
  WRITE: {
    ISSUE_NEW_LAND: 'issueNewLand',
    BATCH_ISSUE_NEW_LAND: 'batchIssueNewLand',
    CREATE_SINGLE_LAND_ORDER: 'createSingleLandOrder',
    CREATE_LAND_BUNDLE_ORDER: 'createLandBundleOrder',
    UPDATE_ORDER: 'updateOrder',
    CANCEL_ORDER: 'cancelOrder',
    TAKE_ORDER_BY_ETHER: 'takeOrderByEther',
    COMPLETE_ORDER: 'completeOrder',
    BATCH_TRANSFER_FROM: 'batchTransferFrom',
    WITHDRAWAL: 'withdrawal',
    SET_GK_ISSUE_ADDRESS: 'setGkIssueAddress',
    SET_TOKEN_URI: 'setTokenUri',
    SET_BASE_URI: 'setBaseUri',
  },
};
