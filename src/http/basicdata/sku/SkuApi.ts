import ApiClient from 'http/ApiClient'
import Response from 'model/response/Response'
import QueryParam from 'model/request/QueryParam'
import BatchResult from 'model/basicdata/BatchResult'
import Sku from 'model/basicdata/sku/Sku'
import ThinSku from 'model/commons/ThinSku'

export default class SkuApi {
  /**
   * 批量删除
   *
   */
  static batchDelete (body: string[]): Promise<Response<BatchResult>> {
    return ApiClient.server().post(`/{merchant}/sku/batch/delete`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 创建
   *
   */
  static create (): Promise<Response<Sku>> {
    return ApiClient.server().post(`/{merchant}/sku/create`, {}).then((res) => {
      return res.data
    })
  }

  /**
   * 删除
   *
   */
  static delete (id: string, version: number): Promise<Response<void>> {
    return ApiClient.server().post(`/{merchant}/sku/delete`, {}, {
      params: {
        id: id,
        version: version
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 编辑
   *
   */
  static edit (body: Sku): Promise<Response<void>> {
    return ApiClient.server().post(`/{merchant}/sku/save/modify`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 导出列表
   *
   */
  static exportList (body: QueryParam): Promise<Response<string>> {
    return ApiClient.server().post(`/{merchant}/sku/list/export`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 获取商品详情
   *
   */
  static get (id: string): Promise<Response<Sku>> {
    return ApiClient.server().get(`/{merchant}/sku/get`, {
      params: {
        id: id
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 获取商品简单信息
   *
   */
  static getThin (id: string): Promise<Response<ThinSku>> {
    return ApiClient.server().get(`/{merchant}/sku/getThin`, {
      params: {
        id: id
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 分页查询
   *
   */
  static query (body: QueryParam): Promise<Response<Sku[]>> {
    return ApiClient.server().post(`/{merchant}/sku/query`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 分页查询
   *
   */
  static queryAll (body: QueryParam): Promise<Response<Sku[]>> {
    return ApiClient.server().post(`/{merchant}/sku/queryAll`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 新建
   *
   */
  static saveNew (body: Sku): Promise<Response<string>> {
    return ApiClient.server().post(`/{merchant}/sku/save/new`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 更新商户下所有商品的smartCodes，便宜字母查询
   *
   */
  static updateAll (): Promise<Response<void>> {
    return ApiClient.server().get(`/{merchant}/sku/updateAll`).then((res) => {
      return res.data
    })
  }

}
