import Ucn from 'model/entity/Ucn'

export default class ReceivableReport {
  merchant: Nullable<string>
  customer: Nullable<Ucn>
  businessDate: Nullable<Date>
  beginingAmount: number = 0
  inAmount: number = 0
  discountAmount: number = 0
  receivedAmount: number = 0
  amount: number = 0
}
