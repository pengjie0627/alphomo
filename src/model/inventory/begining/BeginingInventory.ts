import Entity from 'model/entity/Entity'
import ThinSku from 'model/commons/ThinSku'
import Ucn from 'model/entity/Ucn'

export default class BeginingInventory extends Entity {
  merchant: Nullable<string>
  warehouse: Nullable<Ucn>
  sku: Nullable<ThinSku>
  beginingCostPrice: number = 0
  beginingQty: number = 0
  beginingAmount: number = 0
  taxExcBeginingCostPrice: number = 0
  taxExcBeginingAmount: number = 0
  editable: boolean = false
}
