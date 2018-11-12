import ApiClient from 'http/ApiClient'
import Response from 'model/response/Response'
import QueryParam from 'model/request/QueryParam'
import ContextPageInfo from 'model/commons/ContextPageInfo'
import Purchase from 'model/purchase/Purchase'

export default class PurchaseApi {
  /**
   * 作废进货单
   *
   * @param id 进货单uuid
   */
  static abolish (id: string, version: number): Promise<Response<Purchase>> {
    return ApiClient.server().post(`{merchant}/purchase/abolish`, {}, {
      params: {
        id: id,
        version: version
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 审核进货单
   *
   * @param id 进货单uuid
   */
  static audit (id: string, version: number): Promise<Response<Purchase>> {
    return ApiClient.server().post(`{merchant}/purchase/audit`, {}, {
      params: {
        id: id,
        version: version
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 复制
   *
   */
  static copy (id: string): Promise<Response<Purchase>> {
    return ApiClient.server().get(`{merchant}/purchase/copy`, {
      params: {
        id: id
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 创建空的进货单列表
   *
   */
  static create (): Promise<Response<Purchase>> {
    return ApiClient.server().get(`{merchant}/purchase/create`).then((res) => {
      return res.data
    })
  }

  /**
   * 导出进货单详情excel
   *
   */
  static exportPurchaseDetail (uuid: string): Promise<Response<string>> {
    return ApiClient.server().get(`{merchant}/purchase/export`, {
      params: {
        uuid: uuid
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 导出进货单列表excel
   *
   */
  static exportPurchaseList (body: QueryParam): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/purchase/list/export`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 获取进货单
   *
   * @param id 进货单uuid
   */
  static get (id: string): Promise<Response<Purchase>> {
    return ApiClient.server().get(`{merchant}/purchase/get`, {
      params: {
        id: id
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 下一单
   *
   */
  static next (body: ContextPageInfo): Promise<Response<ContextPageInfo>> {
    return ApiClient.server().post(`{merchant}/purchase/next`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 上一单
   *
   */
  static prev (body: ContextPageInfo): Promise<Response<ContextPageInfo>> {
    return ApiClient.server().post(`{merchant}/purchase/prev`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 自定义查询进货单
   *
   */
  static query (body: QueryParam): Promise<Response<Purchase[]>> {
    return ApiClient.server().post(`{merchant}/purchase/query`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 删除进货单
   *
   * @param id 进货单uuid
   */
  static remove (id: string, version: number): Promise<Response<void>> {
    return ApiClient.server().post(`{merchant}/purchase/remove`, {}, {
      params: {
        id: id,
        version: version
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 保存进货单
   *
   */
  static save (body: Purchase): Promise<Response<Purchase>> {
    return ApiClient.server().post(`{merchant}/purchase/save`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 保存并审核进货单
   *
   */
  static saveAndAudit (body: Purchase): Promise<Response<Purchase>> {
    return ApiClient.server().post(`{merchant}/purchase/saveAndAudit`, body).then((res) => {
      return res.data
    })
  }

}
