export default class PurchaseSummary {
  // 进货笔数
  purchaseCount: number = 0
  // 进货数量
  purchaseQty: number = 0
  // 进货总额
  purchaseAmount: number = 0
  // 退货笔数
  returnCount: number = 0
  // 退货数量
  returnQty: number = 0
  // 退货总额
  returnAmount: number = 0
  // 净进货总量
  qty: number = 0
  // 净进货总额
  amount: number = 0
  // 进货总额(去税)
  taxExcPurchaseAmount: number = 0
  // 退货总额(去税)
  taxExcReturnAmount: number = 0
  // 净进货总额(去税)
  taxExcAmount: number = 0
}
