import Entity from 'model/entity/Entity'

export default class Dictionary extends Entity {
  // 可选值
  value: Nullable<string>
  // 可选值类型
  type: Nullable<string>
  // 是否系统初始化
  initialized: boolean = false
  // 商户ID
  merchant: Nullable<string>
  // 排序 默认+1
  sort: number = 0
}
