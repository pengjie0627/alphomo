import AbstractStatementLine from 'model/statement/AbstractStatementLine'

export default class PaymentLine extends AbstractStatementLine {
  amount: number = 0
  foreignAmount: number = 0
}
