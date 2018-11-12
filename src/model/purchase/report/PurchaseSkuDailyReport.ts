import VersionedEntity from 'model/entity/VersionedEntity'
import ThinSku from 'model/commons/ThinSku'

export default class PurchaseSkuDailyReport extends VersionedEntity {
  merchant: Nullable<string>
  created: Nullable<Date>
  lastModified: Nullable<Date>
  taxExcPurchaseAmount: number = 0
  purchaseAmount: number = 0
  taxExcReturnAmount: number = 0
  returnAmount: number = 0
  taxExcAmount: number = 0
  amount: number = 0
  purchaseQty: number = 0
  returnQty: number = 0
  qty: number = 0
  taxExcAvgPrice: number = 0
  avgPrice: number = 0
  purchaseCount: number = 0
  returnCount: number = 0
  businessDate: Nullable<Date>
  sku: Nullable<ThinSku>
}
