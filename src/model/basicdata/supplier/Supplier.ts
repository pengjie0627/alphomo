import StandardEntity from 'model/entity/StandardEntity'
import ContactInfo from 'model/basicdata/ContactInfo'

export default class Supplier extends StandardEntity {
  // 编号
  code: Nullable<string>
  // 名称
  name: Nullable<string>
  // 商户ID
  merchant: Nullable<string>
  // 状态 NORMAL,DELETED
  status: Nullable<string>
  // 备注
  remark: Nullable<string>
  // 联系人信息
  contactInfo: Nullable<ContactInfo>
  // 应付款，计算用的初始值
  payable: number = 0
  // 上一次同步时间
  lastSynced: Nullable<Date>
  // 助记码
  smartCodes: Nullable<string>
  // 发票抬头
  invoiceTitle: Nullable<string>
  // 纳税人人识别号
  registrationNo: Nullable<string>
  // 银行名称
  bankName: Nullable<string>
  // 银行账户
  bankAccount: Nullable<string>
}
