export default class SaleReportSummary {
  amount: number = 0
  count: number = 0
  // 成本额
  costAmount: number = 0
  // 毛利额
  grossAmount: number = 0
  // 毛利率
  grossRate: number = 0
  // 客单价
  perCustomerPrice: number = 0
  taxExcAmount: number = 0
  // 去税毛利额
  taxExcGrossAmount: number = 0
  maxAmountSku: Nullable<string>
}
