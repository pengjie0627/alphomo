import PermCaption from 'model/framework/user/PermCaption'

export default class Permission {
  code: Nullable<string>
  name: Nullable<string>
  // 关联数据id
  id: Nullable<string>
  // 展示值
  caption: Nullable<string>
  captions: PermCaption[] = []
  // 模块
  module: Nullable<string>
}
