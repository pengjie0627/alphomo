import AbstractSale from 'model/sale/AbstractSale'
import ThinBill from 'model/commons/ThinBill'
import SaleLine from 'model/sale/SaleLine'

export default class Sale extends AbstractSale {
  status: Nullable<string>
  lines: SaleLine[] = []
  saleReturns: ThinBill[] = []
}
