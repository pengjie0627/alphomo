import StandardEntity from 'model/entity/StandardEntity'
import Ucn from 'model/entity/Ucn'

export default class ChargeLine extends StandardEntity {
  merchant: Nullable<string>
  charge: Nullable<string>
  accountCategory: Nullable<Ucn>
  amount: number = 0
  amountUpper: Nullable<string>
}
