import StandardEntity from 'model/entity/StandardEntity'
import Merchant from 'model/framework/merchant/Merchant'
import FieldPerm from 'model/framework/role/FieldPerm'
import Role from 'model/framework/role/Role'
import ScopePerm from 'model/framework/role/ScopePerm'
import UserConfig from 'model/framework/user/UserConfig'

export default class User extends StandardEntity {
  // 商户ID
  merchant: Nullable<string>
  // 登录用户名
  login: Nullable<string>
  // 绑定手机号，员工可自己绑定
  loginMobile: Nullable<string>
  // 密码
  password: Nullable<string>
  // 姓名
  name: Nullable<string>
  // 手机
  mobile: Nullable<string>
  // 性别：male, female 
  sex: Nullable<string>
  // 备注
  remark: Nullable<string>
  // 上一次同步时间
  lastSynced: Nullable<Date>
  // 状态 0:正常 1：锁定 2：删除
  status: number = 0
  // 是否是管理员
  admin: boolean = false
  // 角色
  roles: Role[] = []
  // 字段权限。code和name由后端返回
  fieldPerms: FieldPerm[] = []
  // 范围权限。code和name由后端返回。scope：将所选择的仓库id用逗号拼接
  scopePerms: ScopePerm[] = []
  // 价格权限
  pricePerms: FieldPerm[] = []
  // 仓库权限
  warehousePerms: Nullable<ScopePerm>
  // 商户信息
  merchantEntity: Nullable<Merchant>
  // 用户配置信息
  userConfig: Nullable<UserConfig>
}
