import StandardEntity from 'model/entity/StandardEntity'
import Ucn from 'model/entity/Ucn'
import CheckInventoryLine from 'model/inventory/check/CheckInventoryLine'
import OperateLog from 'model/operatelog/OperateLog'
import ExternalBill from 'model/commons/ExternalBill'

export default class CheckInventory extends StandardEntity {
  merchant: Nullable<string>
  billNum: Nullable<string>
  checkDate: Nullable<Date>
  manager: Nullable<Ucn>
  warehouse: Nullable<Ucn>
  profitAmount: number = 0
  lossAmount: number = 0
  status: Nullable<string>
  lines: CheckInventoryLine[] = []
  remark: Nullable<string>
  operateLogs: OperateLog[] = []
  // 盈亏总额
  amount: number = 0
  externalBill: Nullable<ExternalBill>
}
