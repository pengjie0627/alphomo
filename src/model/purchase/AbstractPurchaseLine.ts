import Entity from 'model/entity/Entity'
import ThinSku from 'model/commons/ThinSku'

export default class AbstractPurchaseLine extends Entity {
  merchant: Nullable<string>
  sku: Nullable<ThinSku>
  taxExcAmount: number = 0
  amount: number = 0
  taxExcPrice: number = 0
  price: number = 0
  qty: number = 0
  taxAmount: number = 0
  taxRate: number = 0
  realAmount: number = 0
}
