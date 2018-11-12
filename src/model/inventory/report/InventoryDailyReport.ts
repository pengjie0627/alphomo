import ThinSku from 'model/commons/ThinSku'

export default class InventoryDailyReport {
  merchant: Nullable<string>
  businessDate: Nullable<Date>
  sku: Nullable<ThinSku>
  beginingQty: number = 0
  beginingCostPrice: number = 0
  beginingAmount: number = 0
  inQty: number = 0
  outQty: number = 0
  inAmount: number = 0
  outAmount: number = 0
  qty: number = 0
  amount: number = 0
  costPrice: number = 0
  taxExcAmount: number = 0
  taxExcCostPrice: number = 0
}
