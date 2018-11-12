import FieldPerm from 'model/framework/role/FieldPerm'
import Role from 'model/framework/role/Role'
import ScopePerm from 'model/framework/role/ScopePerm'

export default class UserPerm {
  // 角色列表
  roles: Role[] = []
  // 字段权限列表
  pricePerms: FieldPerm[] = []
  // 范围权限列表
  warehousePerms: Nullable<ScopePerm>
}
