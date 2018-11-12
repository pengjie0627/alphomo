import StandardEntity from 'model/entity/StandardEntity'
import ContactInfo from 'model/basicdata/ContactInfo'

export default class LogisticsCompany extends StandardEntity {
  // 名称
  name: Nullable<string>
  // 商户ID
  merchant: Nullable<string>
  // 备注
  remark: Nullable<string>
  // 状态 NORMAL,DELETED
  status: Nullable<string>
  // 联系人
  contactInfo: Nullable<ContactInfo>
  // 上一次同步时间
  lastSynced: Nullable<Date>
}
