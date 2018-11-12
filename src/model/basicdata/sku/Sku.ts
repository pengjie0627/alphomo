import StandardEntity from 'model/entity/StandardEntity'
import SkuCategory from 'model/basicdata/sku/SkuCategory'
import SkuMunit from 'model/basicdata/sku/SkuMunit'
import Ucn from 'model/entity/Ucn'

export default class Sku extends StandardEntity {
  // 条码
  barcode: Nullable<string>
  // 编码
  code: Nullable<string>
  // 商品名称
  name: Nullable<string>
  // 商户ID
  merchant: Nullable<string>
  // 品牌
  brand: Nullable<string>
  // 单位
  munit: Nullable<string>
  // 规格
  spec: Nullable<string>
  // 包装规格
  qpc: Nullable<string>
  // 零售价 销售的价格
  salePrice: number = 0
  // 批发价 仅供参考，业务上无实际用处
  wholePrice: number = 0
  // 市场价
  minSalePrice: number = 0
  // 参考进货价 用于进货时使用的价格
  // 参考进货价
  refPurchasePrice: number = 0
  // 备注
  remark: Nullable<string>
  // 状态 NORMAL,DELETED
  status: Nullable<string>
  // 商品分类
  category: Nullable<SkuCategory>
  // 上一次同步时间
  lastSynced: Nullable<Date>
  // 库存
  inventory: number = 0
  // 供应商
  supplier: Nullable<Ucn>
  // 助记码
  smartCodes: Nullable<string>
  // sku单位对象列表
  skuMunitList: SkuMunit[] = []
  // 外部编码
  externalCode: Nullable<string>
  // 产地
  origin: Nullable<string>
  // 采购组
  purchaseGroup: Nullable<string>
  // 进项税
  inputTaxRate: number = 0
  // 销项税
  outputTaxRate: number = 0
  // 多包装比例 不提交
  times: number = 1
  // 进货价, 仅用于进货单
  purchasePrice: number = 0
  // 成本价
  costPrice: number = 0
  // 去税参考进货价
  taxExcRefPurchasePrice: number = 0
  // 税收分类编码
  taxClassification: Nullable<string>
}
