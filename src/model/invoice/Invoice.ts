import StandardEntity from 'model/entity/StandardEntity'

export default class Invoice extends StandardEntity {
  merchant: Nullable<string>
  // 单据ID
  bill: Nullable<string>
  // 单据类型
  billType: Nullable<string>
  // 发票代码
  code: Nullable<string>
  // 发票号
  number: Nullable<string>
  // 发票类型
  category: Nullable<string>
  // 发票金额
  amount: number = 0
  // 发票金额大写
  amountUpper: Nullable<string>
}
