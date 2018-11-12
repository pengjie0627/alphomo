import StandardEntity from 'model/entity/StandardEntity'
import ContactInfo from 'model/basicdata/ContactInfo'

export default class Customer extends StandardEntity {
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
  // 应收款项
  receivable: number = 0
  // 上一次同步时间
  lastSynced: Nullable<Date>
  // 客户等级
  customerLevel: Nullable<string>
  // 助记码
  smartCodes: Nullable<string>
  // 客户类型 NORMAL,JOIN,DIRECT
  category: Nullable<string>
}
