import StandardEntity from 'model/entity/StandardEntity'
import Ucn from 'model/entity/Ucn'

export default class AdvancePaymentLine extends StandardEntity {
  accountCategory: Nullable<Ucn>
  amount: number = 0
  amountUpper: Nullable<string>
  exchangeRate: number = 0
  exchangeRateConfig: Nullable<string>
  foreignAmount: number = 0
}
