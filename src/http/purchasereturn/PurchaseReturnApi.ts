import ApiClient from 'http/ApiClient'
import Response from 'model/response/Response'
import QueryParam from 'model/request/QueryParam'
import ContextPageInfo from 'model/commons/ContextPageInfo'
import PurchaseReturn from 'model/purchasereturn/PurchaseReturn'

export default class PurchaseReturnApi {
  /**
   * 作废退货单
   *
   * @param id 退货单uuid
   */
  static abolish (id: string, version: number): Promise<Response<PurchaseReturn>> {
    return ApiClient.server().post(`{merchant}/purchase/return/abolish`, {}, {
      params: {
        id: id,
        version: version
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 审核退货单
   *
   * @param id 退货单uuid
   */
  static audit (id: string, version: number): Promise<Response<PurchaseReturn>> {
    return ApiClient.server().post(`{merchant}/purchase/return/audit`, {}, {
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
  static copy (id: string): Promise<Response<PurchaseReturn>> {
    return ApiClient.server().get(`{merchant}/purchase/return/copy`, {
      params: {
        id: id
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 创建空的退货单列表
   *
   * @param purchase 原退货单uuid
   */
  static create (purchase: string): Promise<Response<PurchaseReturn>> {
    return ApiClient.server().get(`{merchant}/purchase/return/create`, {
      params: {
        purchase: purchase
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 导出进货退货单详情excel
   *
   */
  static exportPurchaseReturnDetail (uuid: string): Promise<Response<string>> {
    return ApiClient.server().get(`{merchant}/purchase/return/detail/export`, {
      params: {
        uuid: uuid
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 导出进货退货单列表excel
   *
   */
  static exportPurchaseReturnList (body: QueryParam): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/purchase/return/list/export`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 获取退货单
   *
   * @param id 退货单uuid
   */
  static get (id: string): Promise<Response<PurchaseReturn>> {
    return ApiClient.server().get(`{merchant}/purchase/return/get`, {
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
    return ApiClient.server().post(`{merchant}/purchase/return/next`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 上一单
   *
   */
  static prev (body: ContextPageInfo): Promise<Response<ContextPageInfo>> {
    return ApiClient.server().post(`{merchant}/purchase/return/prev`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 自定义查询退货单
   *
   */
  static query (body: QueryParam): Promise<Response<PurchaseReturn[]>> {
    return ApiClient.server().post(`{merchant}/purchase/return/query`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 删除退货单
   *
   * @param id 退货单uuid
   * @param version 版本
   */
  static remove (id: string, version: number): Promise<Response<void>> {
    return ApiClient.server().post(`{merchant}/purchase/return/remove`, {}, {
      params: {
        id: id,
        version: version
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 保存退货单
   *
   */
  static save (body: PurchaseReturn): Promise<Response<PurchaseReturn>> {
    return ApiClient.server().post(`{merchant}/purchase/return/save`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 保存并审核退货单
   *
   */
  static saveAndAudit (body: PurchaseReturn): Promise<Response<PurchaseReturn>> {
    return ApiClient.server().post(`{merchant}/purchase/return/saveAndAudit`, body).then((res) => {
      return res.data
    })
  }

}
