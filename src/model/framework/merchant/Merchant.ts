import StandardEntity from 'model/entity/StandardEntity'
import OssResult from 'model/image/OssResult'
import Region from 'model/region/Region'

export default class Merchant extends StandardEntity {
  // 对应的管理员用户
  owner: Nullable<string>
  // 商户名称
  name: Nullable<string>
  // 地址
  address: Nullable<string>
  // 省
  province: Nullable<Region>
  // 市
  city: Nullable<Region>
  // 区/县信息
  district: Nullable<Region>
  // 街道信息
  street: Nullable<Region>
  // 联系人名称
  contact: Nullable<string>
  // logo
  logoImage: Nullable<OssResult>
  // 所属行业
  industry: Nullable<string>
  // 联系电话
  phone: Nullable<string>
  // 由优货同步而来
  externalId: Nullable<string>
  // 最后同步时间
  lastSynced: Nullable<Date>
  // 申请cmdb用
  requestId: Nullable<string>
}
