export const SmartContractMethod = {
  ISSUE_AND_CREATE_SINGLE_PRODUCT_ORDER: 'issueAndCreateSingleProductOrder',
  CREATE_SINGLE_PRODUCT_ORDER: 'createSingleProductOrder',
  UPDATE_ORDER: 'updateOrder',
  CANCEL_ORDER: 'cancelOrder',
  HAS_EXISTENT_TOKEN: 'hasExistentToken',
  HAS_EXISTENT_ORDER: 'hasExistentOrder',
  TAKE_ORDER_BY_ETHER: 'takeOrderByEther',
  GET_ORDER_DETAILS: 'getOrderDetails'
}

export const TakingStatuses = [
  { text: 'All Status', value: '', canEditable: false, textColor: '' },
  { text: 'Off sale', value: 'off_sale', canEditable: true, textColor: 'text-offsale' },
  { text: 'On sale', value: 'on_sale', canEditable: true, textColor: 'text-onsale' },
  { text: 'Holding', value: 'holding', canEditable: false, textColor: 'text-holding' },
  { text: 'Sold', value: 'sold', canEditable: false, textColor: 'text-sold' },
  { text: 'Confirming', value: 'confirming', canEditable: false, textColor: 'text-confirming' },
]