import ApiClient from 'http/ApiClient'
import Response from 'model/response/Response'
import QueryParam from 'model/request/QueryParam'
import AccountCategory from 'model/basicdata/accountcategory/AccountCategory'

export default class AccountCategoryApi {
  /**
   * 删除
   *
   */
  static delete (id: string, version: number): Promise<Response<void>> {
    return ApiClient.server().post(`/{merchant}/accountcategory/delete`, {}, {
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
    return ApiClient.server().post(`/{merchant}/accountcategory/list/export`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 获取
   *
   */
  static get (id: string): Promise<Response<AccountCategory>> {
    return ApiClient.server().get(`/{merchant}/accountcategory/get`, {
      params: {
        id: id
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 获取子分类,code为null获取一级分类
   *
   */
  static getByCategory (code: string): Promise<Response<AccountCategory[]>> {
    return ApiClient.server().get(`/{merchant}/accountcategory/get/byCategory`, {
      params: {
        code: code
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 查询
   *
   */
  static getByCode (code: string): Promise<Response<AccountCategory>> {
    return ApiClient.server().get(`/{merchant}/accountcategory/getByCode`, {
      params: {
        code: code
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 获取商户下的所有科目分类，分层
   *
   */
  static getByMerchant (): Promise<Response<AccountCategory[]>> {
    return ApiClient.server().get(`/{merchant}/accountcategory/getByMerchant`).then((res) => {
      return res.data
    })
  }

  /**
   * 关键字查询
   *
   */
  static query (body: QueryParam): Promise<Response<AccountCategory[]>> {
    return ApiClient.server().post(`/{merchant}/accountcategory/query`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 编辑
   *
   */
  static saveModify (body: AccountCategory): Promise<Response<void>> {
    return ApiClient.server().post(`/{merchant}/accountcategory/modify`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 新建
   *
   */
  static saveNew (body: AccountCategory): Promise<Response<string>> {
    return ApiClient.server().post(`/{merchant}/accountcategory/save`, body).then((res) => {
      return res.data
    })
  }

}
