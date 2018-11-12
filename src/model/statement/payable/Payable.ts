import StandardEntity from 'model/entity/StandardEntity'
import Ucn from 'model/entity/Ucn'

export default class Payable extends StandardEntity {
  merchant: Nullable<string>
  supplier: Nullable<Ucn>
  manager: Nullable<Ucn>
  businessDate: Nullable<Date>
  billNum: Nullable<string>
  billType: Nullable<string>
  amount: number = 0
  paidAmount: number = 0
  remainAmount: number = 0
  settleStatus: Nullable<string>
}
