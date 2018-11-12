import StandardEntity from 'model/entity/StandardEntity'
import Ucn from 'model/entity/Ucn'

export default class SupplierStatementLine extends StandardEntity {
  // 外部单据uuid
  billUuid: Nullable<string>
  // 外部单据号
  billNum: Nullable<string>
  // 外部单据类型
  billType: Nullable<string>
  // 外部单据业务时间
  billBusinessDate: Nullable<Date>
  // 经办人
  billManager: Nullable<Ucn>
  // 应结金额（来源单据）
  amount: number = 0
  // 当前结算金额（本次结算金额）
  paidAmount: number = 0
  // 剩余结算金额（单据结算前剩余可结算金额）
  remainAmount: number = 0
}
