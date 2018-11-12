import AbstractSale from 'model/sale/AbstractSale'
import SaleReturnLine from 'model/salereturn/SaleReturnLine'

export default class SaleReturn extends AbstractSale {
  status: Nullable<string>
  sale: Nullable<string>
  saleBillNum: Nullable<string>
  canReturnAmount: number = 0
  lines: SaleReturnLine[] = []
}
