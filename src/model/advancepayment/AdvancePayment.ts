import StandardEntity from 'model/entity/StandardEntity'
import AdvancePaymentLine from 'model/advancepayment/AdvancePaymentLine'
import Ucn from 'model/entity/Ucn'
import OssResult from 'model/image/OssResult'
import OperateLog from 'model/operatelog/OperateLog'

export default class AdvancePayment extends StandardEntity {
  merchant: Nullable<string>
  billNum: Nullable<string>
  businessDate: Nullable<Date>
  auditedDate: Nullable<Date>
  abolishedDate: Nullable<Date>
  manager: Nullable<Ucn>
  supplier: Nullable<Ucn>
  amount: number = 0
  foreignAmount: number = 0
  paidAmount: number = 0
  currency: Nullable<string>
  externalBillNum: Nullable<string>
  contractNum: Nullable<string>
  status: Nullable<string>
  deductStatus: Nullable<string>
  operateLogs: OperateLog[] = []
  lines: AdvancePaymentLine[] = []
  remark: Nullable<string>
  images: OssResult[] = []
}
