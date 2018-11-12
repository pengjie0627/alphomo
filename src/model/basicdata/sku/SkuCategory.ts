import StandardEntity from 'model/entity/StandardEntity'

export default class SkuCategory extends StandardEntity {
  // 商户ID
  merchant: Nullable<string>
  // 分类名称
  name: Nullable<string>
  // 是层级码，类似001001
  code: Nullable<string>
  // 父级分类
  parent: Nullable<SkuCategory>
  // 上一次同步时间
  lastSynced: Nullable<Date>
  // 子分类
  children: SkuCategory[] = []
}
