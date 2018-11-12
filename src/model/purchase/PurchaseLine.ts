import AbstractPurchaseLine from 'model/purchase/AbstractPurchaseLine'

export default class PurchaseLine extends AbstractPurchaseLine {
  receivedQty: number = 0
  purchase: Nullable<string>
}
