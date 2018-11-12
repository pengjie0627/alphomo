import AbstractStatement from 'model/statement/AbstractStatement'
import Ucn from 'model/entity/Ucn'
import ReceiptLine from 'model/statement/receipt/ReceiptLine'

export default class Receipt extends AbstractStatement {
  customer: Nullable<Ucn>
  amount: number = 0
  discountAmount: number = 0
  rcvdAmount: number = 0
  totalRcvdAmount: number = 0
  remainAmount: number = 0
  status: Nullable<string>
  lines: ReceiptLine[] = []
  settleStatus: Nullable<string>
}
