export default class MerchantConfig {
  // 启用进项税率支持
  enableInputTaxRateSupport: boolean = false
  // 默认进项税率
  inputTaxRate: number = 0
  // 启用销项税率支持
  enableOutputTaxRateSupport: boolean = false
  // 默认销项税率
  outputTaxRate: number = 0
  // 进货单据只显示含税价格和金额
  inputOnlyTax: boolean = false
  // 进货报表只显示含税价格和金额
  inputReportOnlyTax: boolean = false
  // 销售单据只显示含税价格和金额
  outputOnlyTax: boolean = false
  // 销售报表只显示含税价格和金额
  outputReportOnlyTax: boolean = false
  // 进价小数位数
  purchasePriceBit: number = 0
  // 成本价小数位数
  costPriceBit: number = 0
  // 进价单进价默认值
  defaultPurchasePrice: Nullable<string>
  // 汇率算法
  exchangeRate: Nullable<string>
}
