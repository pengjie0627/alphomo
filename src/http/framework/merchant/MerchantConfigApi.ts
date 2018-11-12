import ApiClient from 'http/ApiClient'
import Response from 'model/response/Response'
import MerchantConfig from 'model/framework/merchant/MerchantConfig'

export default class MerchantConfigApi {
  /**
   * 获取
   *
   */
  static get (): Promise<Response<MerchantConfig>> {
    return ApiClient.server().get(`/{merchant}/merchantConfig/get`).then((res) => {
      return res.data
    })
  }

  /**
   * 获取成本价精度
   *
   */
  static getCostPriceBit (): Promise<Response<string>> {
    return ApiClient.server().get(`/{merchant}/merchantConfig/getCostPriceBit`).then((res) => {
      return res.data
    })
  }

  /**
   * 获取进价精度
   *
   */
  static getPurchasePriceBit (): Promise<Response<string>> {
    return ApiClient.server().get(`/{merchant}/merchantConfig/getPurchasePriceBit`).then((res) => {
      return res.data
    })
  }

  /**
   * 更新
   *
   */
  static update (key: string, value: string): Promise<Response<void>> {
    return ApiClient.server().get(`/{merchant}/merchantConfig/update`, {
      params: {
        key: key,
        value: value
      }
    }).then((res) => {
      return res.data
    })
  }

}
