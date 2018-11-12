import AbstractStatementLine from 'model/statement/AbstractStatementLine'

export default class ReceiptLine extends AbstractStatementLine {
  amount: number = 0
  rcvdAmount: number = 0
  remainAmount: number = 0
}
