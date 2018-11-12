import Entity from 'model/entity/Entity'
import ThinSku from 'model/commons/ThinSku'
import Ucn from 'model/entity/Ucn'

export default class Inventory extends Entity {
  merchant: Nullable<string>
  warehouse: Nullable<Ucn>
  sku: Nullable<ThinSku>
  qty: number = 0
  inQty: number = 0
  outQty: number = 0
  costPrice: number = 0
  availableQty: number = 0
}
