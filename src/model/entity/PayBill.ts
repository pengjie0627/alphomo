import Ucn from 'model/entity/Ucn'

export default class PayBill {
  id: Nullable<string>
  billNum: Nullable<string>
  businessType: Nullable<string>
  businessTypeName: Nullable<string>
  businessDate: Nullable<Date>
  manager: Nullable<Ucn>
  settleStatus: Nullable<string>
  realAmount: number = 0
  paidAmount: number = 0
  remainedAmount: number = 0
}
