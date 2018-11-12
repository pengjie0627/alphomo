import SkuCategory from 'model/basicdata/sku/SkuCategory'
import SkuMunit from 'model/basicdata/sku/SkuMunit'

export default class ThinSku {
  id: Nullable<string>
  name: Nullable<string>
  code: Nullable<string>
  barcode: Nullable<string>
  munit: Nullable<string>
  category: Nullable<SkuCategory>
  spec: Nullable<string>
  qpc: Nullable<string>

  // sku单位对象列表 不提交
  skuMunitList: SkuMunit[] = []
  times: number = 1
}
