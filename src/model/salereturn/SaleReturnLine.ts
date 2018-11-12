import AbstractSaleLine from 'model/sale/AbstractSaleLine'

export default class SaleReturnLine extends AbstractSaleLine {
  receivedQty: number = 0
  saleLine: Nullable<string>
  canReturnQty: number = 0
  canReturnAmount: number = 0
}
