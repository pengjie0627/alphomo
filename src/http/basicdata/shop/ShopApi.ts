import ApiClient from 'http/ApiClient'
import Response from 'model/response/Response'
import QueryParam from 'model/request/QueryParam'
import Shop from 'model/basicdata/shop/Shop'

export default class ShopApi {
  /**
   * 批量删除
   *
   */
  static batchDelete (body: string[]): Promise<Response<void>> {
    return ApiClient.server().post(`/{merchant}/shop/batch/delete`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 删除
   *
   */
  static delete (id: string, version: number): Promise<Response<void>> {
    return ApiClient.server().post(`/{merchant}/shop/delete`, {}, {
      params: {
        id: id,
        version: version
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 停用
   *
   */
  static disable (id: string, version: number): Promise<Response<void>> {
    return ApiClient.server().post(`/{merchant}/shop/disable`, {}, {
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
    return ApiClient.server().get(`/{merchant}/shop/resetAuthCode`).then((res) => {
      return res.data
    })
  }

  /**
   * 启用
   *
   */
  static enable (id: string, version: number): Promise<Response<void>> {
    return ApiClient.server().post(`/{merchant}/shop/enable`, {}, {
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
    return ApiClient.server().post(`/{merchant}/shop/list/export`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 获取
   *
   */
  static get (id: string): Promise<Response<Shop>> {
    return ApiClient.server().get(`/{merchant}/shop/get`, {
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
    return ApiClient.server().get(`/{merchant}/shop/getAuthCode`).then((res) => {
      return res.data
    })
  }

  /**
   * 分页查询
   *
   */
  static query (body: QueryParam): Promise<Response<Shop[]>> {
    return ApiClient.server().post(`/{merchant}/shop/query`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 重置密码
   *
   */
  static reset (loginCode: string, loginPwd: string): Promise<Response<void>> {
    return ApiClient.server().post(`/{merchant}/shop/resetPassword`, {}, {
      params: {
        loginCode: loginCode,
        loginPwd: loginPwd
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 编辑
   *
   */
  static saveModify (body: Shop): Promise<Response<void>> {
    return ApiClient.server().post(`/{merchant}/shop/save/modify`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 新建
   *
   */
  static saveNew (body: Shop): Promise<Response<string>> {
    return ApiClient.server().post(`/{merchant}/shop/save/new`, body).then((res) => {
      return res.data
    })
  }

}
