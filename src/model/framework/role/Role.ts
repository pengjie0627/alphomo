import StandardEntity from 'model/entity/StandardEntity'
import FunctionPerm from 'model/framework/role/FunctionPerm'

export default class Role extends StandardEntity {
  // 角色名称
  name: Nullable<string>
  // 商户ID
  merchant: Nullable<string>
  // 备注
  remark: Nullable<string>
  // 最后同步时间
  lastSynced: Nullable<Date>
  // 角色权限
  functionPerms: FunctionPerm[] = []
}
