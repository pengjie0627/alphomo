import ApiClient from 'http/ApiClient'
import Response from 'model/response/Response'
import Merchant from 'model/framework/merchant/Merchant'

export default class MerchantApi {
  /**
   * 获取
   *
   */
  static get (): Promise<Response<Merchant>> {
    return ApiClient.server().get(`/{merchant}/merchant/get`).then((res) => {
      return res.data
    })
  }

  /**
   * 获取
   *
   */
  static getResource (type: string): Promise<Response<string[]>> {
    return ApiClient.server().get(`/{merchant}/merchant/getResource`, {
      params: {
        type: type
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 编辑
   *
   */
  static saveModify (body: Merchant): Promise<Response<string>> {
    return ApiClient.server().post(`/{merchant}/merchant/save/modify`, body).then((res) => {
      return res.data
    })
  }

}
