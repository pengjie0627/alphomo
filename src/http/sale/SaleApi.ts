import ApiClient from 'http/ApiClient'
import Response from 'model/response/Response'
import QueryParam from 'model/request/QueryParam'
import ContextPageInfo from 'model/commons/ContextPageInfo'
import Sale from 'model/sale/Sale'

export default class SaleApi {
  /**
   * 作废销售单
   *
   */
  static abolish (id: string, version: number): Promise<Response<Sale>> {
    return ApiClient.server().post(`{merchant}/sale/abolish`, {}, {
      params: {
        id: id,
        version: version
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 审核销售单
   *
   */
  static audit (id: string, version: number): Promise<Response<Sale>> {
    return ApiClient.server().post(`{merchant}/sale/audit`, {}, {
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
  static copy (id: string): Promise<Response<Sale>> {
    return ApiClient.server().get(`{merchant}/sale/copy`, {
      params: {
        id: id
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 创建不持久化的销售单
   *
   */
  static create (): Promise<Response<Sale>> {
    return ApiClient.server().get(`{merchant}/sale/create`).then((res) => {
      return res.data
    })
  }

  /**
   * 导出明细
   *
   */
  static exportSaleDetail (id: string): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/sale/detail/export`, {}, {
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
  static exportSaleList (body: QueryParam): Promise<Response<string>> {
    return ApiClient.server().post(`{merchant}/sale/list/export`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 获取销售单
   *
   */
  static get (id: string): Promise<Response<Sale>> {
    return ApiClient.server().get(`{merchant}/sale/get`, {
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
    return ApiClient.server().post(`{merchant}/sale/next`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 上一单
   *
   */
  static prev (body: ContextPageInfo): Promise<Response<ContextPageInfo>> {
    return ApiClient.server().post(`{merchant}/sale/prev`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 查询销售单列表
   *
   */
  static query (body: QueryParam): Promise<Response<Sale[]>> {
    return ApiClient.server().post(`{merchant}/sale/query`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 删除销售单
   *
   */
  static remove (id: string, version: number): Promise<Response<void>> {
    return ApiClient.server().post(`{merchant}/sale/remove`, {}, {
      params: {
        id: id,
        version: version
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 保存销售单
   *
   */
  static save (body: Sale): Promise<Response<Sale>> {
    return ApiClient.server().post(`{merchant}/sale/save`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 保存并审核销售单
   *
   */
  static saveAndAudit (body: Sale): Promise<Response<Sale>> {
    return ApiClient.server().post(`{merchant}/sale/saveAndAudit`, body).then((res) => {
      return res.data
    })
  }

}
