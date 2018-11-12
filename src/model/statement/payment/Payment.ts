import AbstractStatement from 'model/statement/AbstractStatement'
import Ucn from 'model/entity/Ucn'
import PaymentLine from 'model/statement/payment/PaymentLine'

export default class Payment extends AbstractStatement {
  supplier: Nullable<Ucn>
  paidAmount: number = 0
  status: Nullable<string>
  lines: PaymentLine[] = []
  currency: Nullable<string>
  lossesAmount: number = 0
  exchangeRate: number = 0
  foreignPaidAmount: number = 0
  foreignAdvanceAmount: number = 0
  foreignTotalAmount: number = 0
  exchangeRateConfig: Nullable<string>
}
