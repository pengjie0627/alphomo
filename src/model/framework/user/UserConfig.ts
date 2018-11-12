import StandardEntity from 'model/entity/StandardEntity'

export default class UserConfig extends StandardEntity {
  user: Nullable<string>
  merchant: Nullable<string>
  // 不再展示初始化流程
  noDisplayInitialization: boolean = false
}
