import ApiClient from 'http/ApiClient'
import Response from 'model/response/Response'
import QueryParam from 'model/request/QueryParam'
import LogisticsCompany from 'model/basicdata/logisticscompany/LogisticsCompany'

export default class LogisticsCompanyApi {
  /**
   * 批量删除
   *
   */
  static batchDelete (body: string[]): Promise<Response<void>> {
    return ApiClient.server().post(`/{merchant}/logisticsCompany/batch/delete`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 删除
   *
   */
  static delete (id: string, version: number): Promise<Response<void>> {
    return ApiClient.server().post(`/{merchant}/logisticsCompany/delete`, {}, {
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
    return ApiClient.server().post(`/{merchant}/logisticsCompany/list/export`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 获取
   *
   */
  static get (id: string): Promise<Response<LogisticsCompany>> {
    return ApiClient.server().get(`/{merchant}/logisticsCompany/get`, {
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
  static query (body: QueryParam): Promise<Response<LogisticsCompany[]>> {
    return ApiClient.server().post(`/{merchant}/logisticsCompany/query`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 分页查询
   *
   */
  static queryAll (body: QueryParam): Promise<Response<LogisticsCompany[]>> {
    return ApiClient.server().post(`/{merchant}/logisticsCompany/queryAll`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 编辑
   *
   */
  static saveModify (body: LogisticsCompany): Promise<Response<void>> {
    return ApiClient.server().post(`/{merchant}/logisticsCompany/save/modify`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 新建
   *
   */
  static saveNew (body: LogisticsCompany): Promise<Response<string>> {
    return ApiClient.server().post(`/{merchant}/logisticsCompany/save/new`, body).then((res) => {
      return res.data
    })
  }

}
