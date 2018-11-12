import Region from 'model/region/Region'

export default class ShopAddress {
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
}
