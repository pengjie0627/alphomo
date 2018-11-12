import StandardEntity from 'model/entity/StandardEntity'
import Ucn from 'model/entity/Ucn'

export default class Receivable extends StandardEntity {
  merchant: Nullable<string>
  customer: Nullable<Ucn>
  manager: Nullable<Ucn>
  businessDate: Nullable<Date>
  billNum: Nullable<string>
  billType: Nullable<string>
  amount: number = 0
  receivedAmount: number = 0
  remainAmount: number = 0
  settleStatus: Nullable<string>
}
