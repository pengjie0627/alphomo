import StandardEntity from 'model/entity/StandardEntity'
import ExternalBill from 'model/commons/ExternalBill'
import Ucn from 'model/entity/Ucn'

export default class AbstractInventoryBill extends StandardEntity {
  merchant: Nullable<string>
  status: Nullable<string>
  billNum: Nullable<string>
  businessDate: Nullable<Date>
  manager: Nullable<Ucn>
  warehouse: Nullable<Ucn>
  contactUnit: Nullable<string>
  remark: Nullable<string>
  source: Nullable<ExternalBill>
}
