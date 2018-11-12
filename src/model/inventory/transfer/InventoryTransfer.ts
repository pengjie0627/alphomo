import StandardEntity from 'model/entity/StandardEntity'
import Ucn from 'model/entity/Ucn'
import InventoryTransferLine from 'model/inventory/transfer/InventoryTransferLine'
import OperateLog from 'model/operatelog/OperateLog'

export default class InventoryTransfer extends StandardEntity {
  merchant: Nullable<string>
  billNum: Nullable<string>
  manager: Nullable<Ucn>
  inWarehouse: Nullable<Ucn>
  outWarehouse: Nullable<Ucn>
  transferDate: Nullable<Date>
  status: Nullable<string>
  remark: Nullable<string>
  lines: InventoryTransferLine[] = []
  operateLogs: OperateLog[] = []
  // 分类 NORMAL,CAR_PICKUP,CAR_BACK
  category: Nullable<string>
  // 外部单号
  externalBillNum: Nullable<string>
}
