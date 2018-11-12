import Ucn from 'model/entity/Ucn'

export default class PaymentBill {
  merchant: Nullable<string>
  id: Nullable<string>
  billNum: Nullable<string>
  billType: Nullable<string>
  businessDate: Nullable<Date>
  manager: Nullable<Ucn>
  status: Nullable<string>
  amount: number = 0
  foreignAmount: number = 0
  category: Nullable<string>
}
