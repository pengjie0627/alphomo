import MerchantConfig from 'model/framework/merchant/MerchantConfig'
import Merchant from 'model/framework/merchant/Merchant'
import User from 'model/framework/user/User'

export default class LoginResult {
  // 用户信息
  user: Nullable<User>
  // 商户配置信息
  merchantConfig: Nullable<MerchantConfig>
  // 商户信息
  merchant: Nullable<Merchant>
}
