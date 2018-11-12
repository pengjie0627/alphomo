import ApiClient from 'http/ApiClient'
import Response from 'model/response/Response'
import QueryParam from 'model/request/QueryParam'
import Supplier from 'model/basicdata/supplier/Supplier'
import ThinSupplier from 'model/basicdata/supplier/ThinSupplier'

export default class SupplierApi {
  /**
   * 批量删除
   *
   */
  static batchDelete (body: string[]): Promise<Response<void>> {
    return ApiClient.server().post(`/{merchant}/supplier/batch/delete`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 创建
   *
   */
  static create (): Promise<Response<Supplier>> {
    return ApiClient.server().post(`/{merchant}/supplier/create`, {}).then((res) => {
      return res.data
    })
  }

  /**
   * 删除
   *
   */
  static delete (id: string, version: number): Promise<Response<void>> {
    return ApiClient.server().post(`/{merchant}/supplier/delete`, {}, {
      params: {
        id: id,
        version: version
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 导出列表
   *
   */
  static exportList (body: QueryParam): Promise<Response<string>> {
    return ApiClient.server().post(`/{merchant}/supplier/list/export`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 获取
   *
   */
  static get (id: string): Promise<Response<Supplier>> {
    return ApiClient.server().get(`/{merchant}/supplier/get`, {
      params: {
        id: id
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 获取简单信息
   *
   */
  static getThin (id: string): Promise<Response<ThinSupplier>> {
    return ApiClient.server().get(`/{merchant}/supplier/getThin`, {
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
  static query (body: QueryParam): Promise<Response<Supplier[]>> {
    return ApiClient.server().post(`/{merchant}/supplier/query`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 分页查询
   *
   */
  static queryAll (body: QueryParam): Promise<Response<Supplier[]>> {
    return ApiClient.server().post(`/{merchant}/supplier/queryAll`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 编辑
   *
   */
  static saveModify (body: Supplier): Promise<Response<void>> {
    return ApiClient.server().post(`/{merchant}/supplier/save/modify`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 新建
   *
   */
  static saveNew (body: Supplier): Promise<Response<string>> {
    return ApiClient.server().post(`/{merchant}/supplier/save/new`, body).then((res) => {
      return res.data
    })
  }

}
