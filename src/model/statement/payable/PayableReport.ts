import Ucn from 'model/entity/Ucn'

export default class PayableReport {
  merchant: Nullable<string>
  supplier: Nullable<Ucn>
  businessDate: Nullable<Date>
  beginingAmount: number = 0
  outAmount: number = 0
  discountAmount: number = 0
  paidAmount: number = 0
  amount: number = 0
}
