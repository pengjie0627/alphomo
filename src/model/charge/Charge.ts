import StandardEntity from 'model/entity/StandardEntity'
import ChargeLine from 'model/charge/ChargeLine'
import Ucn from 'model/entity/Ucn'
import OssResult from 'model/image/OssResult'
import OperateLog from 'model/operatelog/OperateLog'

export default class Charge extends StandardEntity {
  merchant: Nullable<string>
  billNum: Nullable<string>
  businessDate: Nullable<Date>
  auditedDate: Nullable<Date>
  abolishedDate: Nullable<Date>
  manager: Nullable<Ucn>
  supplier: Nullable<Ucn>
  amount: number = 0
  status: Nullable<string>
  payStatus: Nullable<string>
  category: Nullable<string>
  operateLogs: OperateLog[] = []
  lines: ChargeLine[] = []
  remark: Nullable<string>
  images: OssResult[] = []
}
