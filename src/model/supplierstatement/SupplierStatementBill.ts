import Ucn from 'model/entity/Ucn'

export default class SupplierStatementBill {
  id: Nullable<string>
  // 单号
  billNum: Nullable<string>
  // 业务类型
  businessType: Nullable<string>
  // 业务类型名称
  businessTypeName: Nullable<string>
  // 业务时间
  businessDate: Nullable<Date>
  // 经办人
  manager: Nullable<Ucn>
  // 核销状态
  settleStatus: Nullable<string>
  // 应结金额
  realAmount: number = 0
  // 已结金额
  paidAmount: number = 0
  // 剩余应结金额
  remainedAmount: number = 0
}
