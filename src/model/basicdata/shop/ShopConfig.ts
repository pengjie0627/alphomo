import StandardEntity from 'model/entity/StandardEntity'

export default class ShopConfig extends StandardEntity {
  // 商户id
  merchant: Nullable<string>
  // 门店id
  shop: Nullable<string>
  // 门店配置名称
  key: Nullable<string>
  // 门店配置值
  value: Nullable<string>
}
