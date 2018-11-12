import StandardEntity from 'model/entity/StandardEntity'
import Ucn from 'model/entity/Ucn'
import OperateLog from 'model/operatelog/OperateLog'

export default class AbstractPurchase extends StandardEntity {
  merchant: Nullable<string>
  billNum: Nullable<string>
  businessDate: Nullable<Date>
  manager: Nullable<Ucn>
  supplier: Nullable<Ucn>
  warehouse: Nullable<Ucn>
  taxExcAmount: number = 0
  amount: number = 0
  paidAmount: number = 0
  taxAmount: number = 0
  chargeAmount: number = 0
  discountAmount: number = 0
  realAmount: number = 0
  settleStatus: Nullable<string>
  // 付款状态
  payStatus: Nullable<string>
  remark: Nullable<string>
  operateLogs: OperateLog[] = []
}
