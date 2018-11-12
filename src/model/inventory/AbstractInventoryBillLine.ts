import Entity from 'model/entity/Entity'
import ThinSku from 'model/commons/ThinSku'

export default class AbstractInventoryBillLine extends Entity {
  merchant: Nullable<string>
  sku: Nullable<ThinSku>
  costPrice: number = 0
  qty: number = 0
  remark: Nullable<string>
}
