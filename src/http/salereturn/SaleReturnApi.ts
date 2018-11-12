import ApiClient from 'http/ApiClient'
import Response from 'model/response/Response'
import QueryParam from 'model/request/QueryParam'
import ContextPageInfo from 'model/commons/ContextPageInfo'
import SaleReturn from 'model/salereturn/SaleReturn'

export default class SaleReturnApi {
  /**
   * 作废销售退货单
   *
   */
  static abolish (id: string, version: number): Promise<Response<SaleReturn>> {
    return ApiClient.server().post(`{merchant}/saleReturn/abolish`, {}, {
      params: {
        id: id,
        version: version
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 审核销售退货单
   *
   */
  static audit (id: string, version: number): Promise<Response<SaleReturn>> {
    return ApiClient.server().post(`{merchant}/saleReturn/audit`, {}, {
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
  static copy (id: string): Promise<Response<SaleReturn>> {
    return ApiClient.server().get(`{merchant}/saleReturn/copy`, {
      params: {
        id: id
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 创建不持久化的销售退货单
   *
   */
  static create (sale: string): Promise<Response<SaleReturn>> {
    return ApiClient.server().get(`{merchant}/saleReturn/create`, {
      params: {
        sale: sale
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 导出明细
   *
   */
  static exportSaleReturnDetail (id: string): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/saleReturn/detail/export`, {}, {
      params: {
        id: id
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 导出列表
   *
   */
  static exportSaleReturnList (body: QueryParam): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/saleReturn/list/export`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 获取销售退货单
   *
   */
  static get (id: string, forUpdate: boolean): Promise<Response<SaleReturn>> {
    return ApiClient.server().get(`{merchant}/saleReturn/get`, {
      params: {
        id: id,
        forUpdate: forUpdate
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
    return ApiClient.server().post(`{merchant}/saleReturn/next`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 上一单
   *
   */
  static prev (body: ContextPageInfo): Promise<Response<ContextPageInfo>> {
    return ApiClient.server().post(`{merchant}/saleReturn/prev`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 查询销售退货单列表
   *
   */
  static query (body: QueryParam): Promise<Response<SaleReturn[]>> {
    return ApiClient.server().post(`{merchant}/saleReturn/query`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 删除销售退货单
   *
   */
  static remove (id: string, version: number): Promise<Response<void>> {
    return ApiClient.server().post(`{merchant}/saleReturn/remove`, {}, {
      params: {
        id: id,
        version: version
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 保存销售退货单
   *
   */
  static save (body: SaleReturn): Promise<Response<SaleReturn>> {
    return ApiClient.server().post(`{merchant}/saleReturn/save`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 保存并审核销售退货单
   *
   */
  static saveAndAudit (body: SaleReturn): Promise<Response<SaleReturn>> {
    return ApiClient.server().post(`{merchant}/saleReturn/saveAndAudit`, body).then((res) => {
      return res.data
    })
  }

}
