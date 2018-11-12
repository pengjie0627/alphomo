import StandardEntity from 'model/entity/StandardEntity'
import Ucn from 'model/entity/Ucn'
import OssResult from 'model/image/OssResult'

export default class AbstractStatement extends StandardEntity {
  billNum: Nullable<string>
  merchant: Nullable<string>
  manager: Nullable<Ucn>
  remark: Nullable<string>
  images: OssResult[] = []
  businessDate: Nullable<Date>
}
