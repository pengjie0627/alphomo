export default class SaleBusinessReport {
  // 业务日期
  businessDate: Nullable<Date>
  // 单据Uuid
  uuid: Nullable<string>
  // 单据编号
  billNum: Nullable<string>
  // 单据类型
  billType: Nullable<string>
  // 单据来源
  externalBillSource: Nullable<string>
  // 来源类型
  externalBillType: Nullable<string>
  // 销售量
  qty: number = 0
  // 销售额
  amount: number = 0
  // 销售均价
  avgPrice: number = 0
  // 成本额
  costAmount: number = 0
  // 毛利额
  grossAmount: number = 0
  // 毛利率
  grossRate: number = 0
  // 客单价
  perCustomerPrice: number = 0
  // 去税销售额
  taxExcAmount: number = 0
  // 去税销售均价
  taxExcAvgPrice: number = 0
  // 去税毛利额
  taxExcGrossAmount: number = 0
}
