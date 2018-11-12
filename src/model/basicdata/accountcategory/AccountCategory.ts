import StandardEntity from 'model/entity/StandardEntity'

export default class AccountCategory extends StandardEntity {
  // 编号
  code: Nullable<string>
  // 名称
  name: Nullable<string>
  // 商户ID
  merchant: Nullable<string>
  // 状态 NORMAL,DELETED
  status: Nullable<string>
  // 上级编码
  parent: Nullable<string>
  // 层级
  level: Nullable<string>
  // 子分类
  children: AccountCategory[] = []
}
