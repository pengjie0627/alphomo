import ApiClient from 'http/ApiClient'
import Response from 'model/response/Response'
import QueryParam from 'model/request/QueryParam'
import Warehouse from 'model/basicdata/warehouses/Warehouse'

export default class WarehouseApi {
  /**
   * 批量删除
   *
   */
  static batchDelete (body: string[]): Promise<Response<void>> {
    return ApiClient.server().post(`/{merchant}/warehouse/batch/delete`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 停用
   *
   */
  static delete (id: string, version: number): Promise<Response<void>> {
    return ApiClient.server().post(`/{merchant}/warehouse/delete`, {}, {
      params: {
        id: id,
        version: version
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 导出列表（数据同queryAll）
   *
   */
  static exportList (body: QueryParam): Promise<Response<string>> {
    return ApiClient.server().post(`/{merchant}/warehouse/list/export`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 获取
   *
   */
  static get (id: string): Promise<Response<Warehouse>> {
    return ApiClient.server().get(`/{merchant}/warehouse/get`, {
      params: {
        id: id
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 仓库分页查询(包括车辆类型）
   *
   */
  static query (body: QueryParam): Promise<Response<Warehouse[]>> {
    return ApiClient.server().post(`/{merchant}/warehouse/query`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 仓库分页查询(不包括车辆类型）
   *
   */
  static queryExcludeCar (body: QueryParam): Promise<Response<Warehouse[]>> {
    return ApiClient.server().post(`/{merchant}/warehouse/queryExcludeCar`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 仓库分页查询
   *
   */
  static queryAll (body: QueryParam): Promise<Response<Warehouse[]>> {
    return ApiClient.server().post(`/{merchant}/warehouse/queryAll`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 编辑
   *
   */
  static saveModify (body: Warehouse): Promise<Response<void>> {
    return ApiClient.server().post(`/{merchant}/warehouse/save/modify`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 新建
   *
   */
  static saveNew (body: Warehouse): Promise<Response<string>> {
    return ApiClient.server().post(`/{merchant}/warehouse/save/new`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 启用
   *
   */
  static unDelete (id: string, version: number): Promise<Response<void>> {
    return ApiClient.server().post(`/{merchant}/warehouse/un/delete`, {}, {
      params: {
        id: id,
        version: version
      }
    }).then((res) => {
      return res.data
    })
  }

}
