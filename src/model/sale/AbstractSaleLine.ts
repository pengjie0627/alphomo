import Entity from 'model/entity/Entity'
import ThinSku from 'model/commons/ThinSku'

export default class AbstractSaleLine extends Entity {
  sku: Nullable<ThinSku>
  taxExcPrice: number = 0
  price: number = 0
  costPrice: number = 0
  qty: number = 0
  taxExcAmount: number = 0
  amount: number = 0
  taxRate: number = 0
  taxAmount: number = 0
}
