import AbstractPurchase from 'model/purchase/AbstractPurchase'
import PurchaseReturnLine from 'model/purchasereturn/PurchaseReturnLine'

export default class PurchaseReturn extends AbstractPurchase {
  purchase: Nullable<string>
  purchaseBillNum: Nullable<string>
  status: Nullable<string>
  canReturnAmount: number = 0
  lines: PurchaseReturnLine[] = []
}
