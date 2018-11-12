import ThinSku from 'model/commons/ThinSku'
import Ucn from 'model/entity/Ucn'

export default class InventoryTransaction {
  id: Nullable<string>
  merchant: Nullable<string>
  businessDate: Nullable<Date>
  contactUnit: Nullable<string>
  warehouse: Nullable<Ucn>
  billNum: Nullable<string>
  sku: Nullable<ThinSku>
  inQty: number = 0
  outQty: number = 0
  sourceBillType: Nullable<string>
}
