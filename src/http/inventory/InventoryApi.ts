import ApiClient from 'http/ApiClient'
import Response from 'model/response/Response'
import QueryParam from 'model/request/QueryParam'
import Inventory from 'model/inventory/Inventory'

export default class InventoryApi {
  /**
   * 导出
   *
   */
  static export (body: QueryParam): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/inventory/export`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 库存-查询
   *
   */
  static query (body: QueryParam): Promise<Response<Inventory[]>> {
    return ApiClient.server().post(`{merchant}/inventory/query`, body).then((res) => {
      return res.data
    })
  }

}
