import Entity from 'model/entity/Entity'
import ThinSku from 'model/commons/ThinSku'

export default class InventoryTransferLine extends Entity {
  merchant: Nullable<string>
  inventoryTransfer: Nullable<string>
  sku: Nullable<ThinSku>
  qty: number = 0
  costPrice: number = 0
  remark: Nullable<string>
}
