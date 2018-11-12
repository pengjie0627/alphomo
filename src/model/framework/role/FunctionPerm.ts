export default class FunctionPerm {
  // 权限唯一编码
  code: Nullable<string>
  // 权限名称
  name: Nullable<string>
  // 前端展示值
  caption: Nullable<string>
  // 子模块
  children: FunctionPerm[] = []
}
