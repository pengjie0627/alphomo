export default class SaleSummary {
  // 销售笔数
  saleCount: number = 0
  // 销售数量
  saleQty: number = 0
  // 销售总额
  saleAmount: number = 0
  // 退货笔数
  returnCount: number = 0
  // 退货数量
  returnQty: number = 0
  // 退货总额
  returnAmount: number = 0
  // 净销售总量
  qty: number = 0
  // 净销售总额
  amount: number = 0
  // 成本额
  costAmount: number = 0
  // 毛利额
  grossAmount: number = 0
  // 毛利率
  grossRate: number = 0
  // 客单价
  perCustomerPrice: number = 0
  // 去税销售总额(含退货)
  taxExcAmount: number = 0
  // 去税销售总额
  taxExcSaleAmount: number = 0
  // 去税退货总额
  taxExcReturnAmount: number = 0
  // 去税毛利额
  taxExcGrossAmount: number = 0
}
