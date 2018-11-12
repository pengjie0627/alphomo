import Entity from 'model/entity/Entity'
import ThinSku from 'model/commons/ThinSku'

export default class CheckInventoryLine extends Entity {
  checkInventory: Nullable<string>
  merchant: Nullable<string>
  sku: Nullable<ThinSku>
  paperQty: number = 0
  qty: number = 0
  costPrice: number = 0
  remark: Nullable<string>
  amount: number = 0
  balanceQty: number = 0
}
