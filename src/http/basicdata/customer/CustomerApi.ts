import ApiClient from 'http/ApiClient'
import Response from 'model/response/Response'
import QueryParam from 'model/request/QueryParam'
import Customer from 'model/basicdata/customer/Customer'
import ThinCustomer from 'model/basicdata/customer/ThinCustomer'

export default class CustomerApi {
  /**
   * 批量删除
   *
   */
  static batchDelete (body: string[]): Promise<Response<void>> {
    return ApiClient.server().post(`/{merchant}/customer/batch/delete`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 创建
   *
   */
  static create (): Promise<Response<Customer>> {
    return ApiClient.server().post(`/{merchant}/customer/create`, {}).then((res) => {
      return res.data
    })
  }

  /**
   * 删除
   *
   */
  static delete (id: string, version: number): Promise<Response<void>> {
    return ApiClient.server().post(`/{merchant}/customer/delete`, {}, {
      params: {
        id: id,
        version: version
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 重置授权码
   *
   */
  static dmmResetAuthCode (): Promise<Response<string>> {
    return ApiClient.server().get(`/{merchant}/customer/resetAuthCode`).then((res) => {
      return res.data
    })
  }

  /**
   * 导出列表
   *
   */
  static exportList (body: QueryParam): Promise<Response<string>> {
    return ApiClient.server().post(`/{merchant}/customer/list/export`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 获取
   *
   */
  static get (id: string): Promise<Response<Customer>> {
    return ApiClient.server().get(`/{merchant}/customer/get`, {
      params: {
        id: id
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 查看授权码
   *
   */
  static getAuthCode (): Promise<Response<string>> {
    return ApiClient.server().get(`/{merchant}/customer/getAuthCode`).then((res) => {
      return res.data
    })
  }

  /**
   * 获取简单信息
   *
   */
  static getThin (id: string): Promise<Response<ThinCustomer>> {
    return ApiClient.server().get(`/{merchant}/customer/getThin`, {
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
  static query (body: QueryParam): Promise<Response<Customer[]>> {
    return ApiClient.server().post(`/{merchant}/customer/query`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 对话框查询
   *
   */
  static queryAll (body: QueryParam): Promise<Response<Customer[]>> {
    return ApiClient.server().post(`/{merchant}/customer/queryAll`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 编辑
   *
   */
  static saveModify (body: Customer): Promise<Response<void>> {
    return ApiClient.server().post(`/{merchant}/customer/save/modify`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 新建
   *
   */
  static saveNew (body: Customer): Promise<Response<string>> {
    return ApiClient.server().post(`/{merchant}/customer/save/new`, body).then((res) => {
      return res.data
    })
  }

}
