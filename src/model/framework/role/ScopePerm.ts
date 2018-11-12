import PermCaption from 'model/framework/user/PermCaption'

export default class ScopePerm {
  // 权限唯一编码
  code: Nullable<string>
  // 权限名称
  name: Nullable<string>
  // 范围权限值，逗号分隔
  scope: Nullable<string>
  // 范围权限数据信息
  captions: PermCaption[] = []
}
