import StandardEntity from 'model/entity/StandardEntity'
import ExternalBill from 'model/commons/ExternalBill'
import Ucn from 'model/entity/Ucn'
import OperateLog from 'model/operatelog/OperateLog'

export default class AbstractSale extends StandardEntity {
  merchant: Nullable<string>
  billNum: Nullable<string>
  businessDate: Nullable<Date>
  manager: Nullable<Ucn>
  warehouse: Nullable<Ucn>
  customer: Nullable<Ucn>
  settleStatus: Nullable<string>
  amount: number = 0
  taxExcAmount: number = 0
  taxAmount: number = 0
  chargeAmount: number = 0
  discountAmount: number = 0
  paidAmount: number = 0
  realAmount: number = 0
  externalBill: Nullable<ExternalBill>
  operateLogs: OperateLog[] = []
  remark: Nullable<string>
}
