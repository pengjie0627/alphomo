import AbstractPurchaseLine from 'model/purchase/AbstractPurchaseLine'

export default class PurchaseReturnLine extends AbstractPurchaseLine {
  deliveredQty: number = 0
  purchaseLine: Nullable<string>
  purchaseReturn: Nullable<string>
  canReturnQty: number = 0
  canReturnAmount: number = 0
}
