export default class PurchaseBusinessReport {
  // 业务日期
  businessDate: Nullable<Date>
  // 单据Uuid
  uuid: Nullable<string>
  // 单据编号
  billNum: Nullable<string>
  // 单据类型
  billType: Nullable<string>
  // 进货量
  qty: number = 0
  // 进货额
  amount: number = 0
  // 进货均价
  avgPrice: number = 0
  // 进货额(去税)
  taxExcAmount: number = 0
  // 进货均价(去税)
  taxExcAvgPrice: number = 0
}
