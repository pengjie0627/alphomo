import ApiClient from 'http/ApiClient'
import Response from 'model/response/Response'
import QueryParam from 'model/request/QueryParam'
import BeginingInventory from 'model/inventory/begining/BeginingInventory'
import BeginingInventoryResult from 'model/inventory/begining/BeginingInventoryResult'

export default class InventoryBeginingApi {
  /**
   * 期初库存-批量新增
   *
   */
  static batchCreate (body: BeginingInventory[]): Promise<Response<BeginingInventoryResult>> {
    return ApiClient.server().post(`{merchant}/inventory/begining/batch_create`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 期初库存-批量删除
   *
   */
  static batchDelete (body: string[]): Promise<Response<BeginingInventoryResult>> {
    return ApiClient.server().post(`{merchant}/inventory/begining/batch_delete`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 期初库存-详情
   *
   */
  static detail (uuid: string): Promise<Response<BeginingInventory>> {
    return ApiClient.server().post(`{merchant}/inventory/begining/${uuid}/detail`, {}).then((res) => {
      return res.data
    })
  }

  /**
   * 期初库存-导出
   *
   */
  static export (body: QueryParam): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/inventory/begining/export`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 期初库存-查询
   *
   */
  static query (body: QueryParam): Promise<Response<BeginingInventory[]>> {
    return ApiClient.server().post(`{merchant}/inventory/begining/query`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 期初库存-编辑
   *
   */
  static saveModify (uuid: string, body: BeginingInventory): Promise<Response<BeginingInventory>> {
    return ApiClient.server().post(`{merchant}/inventory/begining/${uuid}/save`, body).then((res) => {
      return res.data
    })
  }

}
