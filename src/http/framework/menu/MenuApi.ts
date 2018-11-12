import ApiClient from 'http/ApiClient'
import Response from 'model/response/Response'
import Menu from 'model/framework/menu/Menu'

export default class MenuApi {
  /**
   * 获取菜单列表
   *
   */
  static listMenus (): Promise<Response<Menu[]>> {
    return ApiClient.server().get(`/{merchant}/menu/listMenus`).then((res) => {
      return res.data
    })
  }

}
