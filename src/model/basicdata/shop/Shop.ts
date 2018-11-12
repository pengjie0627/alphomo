import StandardEntity from 'model/entity/StandardEntity'
import ContactInfo from 'model/basicdata/ContactInfo'
import ShopAddress from 'model/basicdata/shop/ShopAddress'
import ShopConfig from 'model/basicdata/shop/ShopConfig'

export default class Shop extends StandardEntity {
  // 门店编号
  code: Nullable<string>
  // 名称
  name: Nullable<string>
  // 门店简称
  shortName: Nullable<string>
  // 登录账号
  loginCode: Nullable<string>
  // 商户ID
  merchant: Nullable<string>
  // 启用状态
  state: Nullable<string>
  // 联系人信息
  contactInfo: Nullable<ContactInfo>
  // 地址信息
  shopAddress: Nullable<ShopAddress>
  // 门店配置信息
  shopConfig: ShopConfig[] = []
}
