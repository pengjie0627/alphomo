import ApiClient from 'http/ApiClient'
import Response from 'model/response/Response'
import UserConfig from 'model/framework/user/UserConfig'

export default class UserConfigApi {
  /**
   * 获取
   *
   */
  static get (user: string): Promise<Response<UserConfig>> {
    return ApiClient.server().get(`/{merchant}/userConfig/get`, {
      params: {
        user: user
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 获取
   *
   */
  static getByKey (user: string, key: string): Promise<Response<any>> {
    return ApiClient.server().get(`/{merchant}/userConfig/get/byKey`, {
      params: {
        user: user,
        key: key
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 获取
   *
   */
  static update (user: string, key: string, value: string): Promise<Response<void>> {
    return ApiClient.server().get(`/{merchant}/userConfig/update`, {
      params: {
        user: user,
        key: key,
        value: value
      }
    }).then((res) => {
      return res.data
    })
  }

}
