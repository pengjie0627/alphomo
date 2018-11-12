import ApiClient from 'http/ApiClient'
import Response from 'model/response/Response'
import QueryParam from 'model/request/QueryParam'
import Dictionary from 'model/basicdata/dictionary/Dictionary'

export default class DictionaryApi {
  /**
   * 添加
   *
   */
  static adds (type: string, body: string[]): Promise<Response<void>> {
    return ApiClient.server().post(`/{merchant}/dictionary/adds`, body, {
      params: {
        type: type
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 批量删除
   *
   */
  static batchDelete (body: string[]): Promise<Response<void>> {
    return ApiClient.server().post(`/{merchant}/dictionary/batch/delete`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 删除
   *
   */
  static delete (type: string, value: string): Promise<Response<void>> {
    return ApiClient.server().post(`/{merchant}/dictionary/delete`, {}, {
      params: {
        type: type,
        value: value
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 导出采购组
   *
   */
  static exportPurchaseGroup (body: QueryParam): Promise<Response<string>> {
    return ApiClient.server().post(`/{merchant}/dictionary/list/exportPurchaseGroup`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 获取数据字典内容
   *
   */
  static list (type: string): Promise<Response<Dictionary[]>> {
    return ApiClient.server().post(`/{merchant}/dictionary/list`, {}, {
      params: {
        type: type
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 查询采购组内容
   *
   */
  static query (body: QueryParam): Promise<Response<Dictionary[]>> {
    return ApiClient.server().post(`/{merchant}/dictionary/query`, body).then((res) => {
      return res.data
    })
  }

}
