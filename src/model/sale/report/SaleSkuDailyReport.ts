import VersionedEntity from 'model/entity/VersionedEntity'
import ThinSku from 'model/commons/ThinSku'

export default class SaleSkuDailyReport extends VersionedEntity {
  merchant: Nullable<string>
  created: Nullable<Date>
  lastModified: Nullable<Date>
  saleAmount: number = 0
  returnAmount: number = 0
  amount: number = 0
  saleQty: number = 0
  returnQty: number = 0
  qty: number = 0
  avgPrice: number = 0
  saleCount: number = 0
  returnCount: number = 0
  // 成本额
  costAmount: number = 0
  // 毛利额
  grossAmount: number = 0
  // 毛利率
  grossRate: number = 0
  // 客单价
  perCustomerPrice: number = 0
  businessDate: Nullable<Date>
  sku: Nullable<ThinSku>
  taxExcSaleAmount: number = 0
  taxExcReturnAmount: number = 0
  taxExcAmount: number = 0
  taxExcAvgPrice: number = 0
  // 去税毛利额
  taxExcGrossAmount: number = 0
  // 去税客单价
  taxExcPerCustomerPrice: number = 0
}
