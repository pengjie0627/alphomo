import AbstractPurchase from 'model/purchase/AbstractPurchase'
import ThinBill from 'model/commons/ThinBill'
import PurchaseLine from 'model/purchase/PurchaseLine'

export default class Purchase extends AbstractPurchase {
  status: Nullable<string>
  lines: PurchaseLine[] = []
  purchaseReturns: ThinBill[] = []
}
