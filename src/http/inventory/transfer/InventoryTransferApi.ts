import ApiClient from 'http/ApiClient'
import Response from 'model/response/Response'
import QueryParam from 'model/request/QueryParam'
import ContextPageInfo from 'model/commons/ContextPageInfo'
import InventoryTransfer from 'model/inventory/transfer/InventoryTransfer'

export default class InventoryTransferApi {
  /**
   * 作废
   *
   */
  static abolish (id: string, version: number): Promise<Response<InventoryTransfer>> {
    return ApiClient.server().post(`/{merchant}/inventory/transfer/abolish`, {}, {
      params: {
        id: id,
        version: version
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 审核
   *
   */
  static audit (id: string, version: number): Promise<Response<InventoryTransfer>> {
    return ApiClient.server().post(`/{merchant}/inventory/transfer/audit`, {}, {
      params: {
        id: id,
        version: version
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 批量审核
   *
   */
  static batchAudit (body: InventoryTransfer[]): Promise<Response<void>> {
    return ApiClient.server().post(`/{merchant}/inventory/transfer/batch/audit`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 批量删除草稿
   *
   */
  static batchRemove (body: InventoryTransfer[]): Promise<Response<void>> {
    return ApiClient.server().post(`/{merchant}/inventory/transfer/batch/remove`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 创建
   *
   */
  static create (): Promise<Response<InventoryTransfer>> {
    return ApiClient.server().get(`/{merchant}/inventory/transfer/create`).then((res) => {
      return res.data
    })
  }

  /**
   * 导出列表
   *
   */
  static exportList (body: QueryParam): Promise<Response<string>> {
    return ApiClient.server().post(`/{merchant}/inventory/transfer/list/export`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 获取
   *
   */
  static get (id: string): Promise<Response<InventoryTransfer>> {
    return ApiClient.server().get(`/{merchant}/inventory/transfer/get`, {
      params: {
        id: id
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 获取并创建
   *
   */
  static getAndCreate (id: string): Promise<Response<InventoryTransfer>> {
    return ApiClient.server().get(`/{merchant}/inventory/transfer/getAndCreate`, {
      params: {
        id: id
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 获取下一单
   *
   */
  static getNext (body: ContextPageInfo): Promise<Response<ContextPageInfo>> {
    return ApiClient.server().post(`/{merchant}/inventory/transfer/get/next`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 获取上一单
   *
   */
  static getPrev (body: ContextPageInfo): Promise<Response<ContextPageInfo>> {
    return ApiClient.server().post(`/{merchant}/inventory/transfer/get/prev`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 查询列表
   *
   */
  static query (body: QueryParam): Promise<Response<InventoryTransfer[]>> {
    return ApiClient.server().post(`/{merchant}/inventory/transfer/query`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 删除草稿
   *
   */
  static remove (id: string, version: number): Promise<Response<void>> {
    return ApiClient.server().post(`/{merchant}/inventory/transfer/remove`, {}, {
      params: {
        id: id,
        version: version
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 保存
   *
   */
  static save (body: InventoryTransfer): Promise<Response<InventoryTransfer>> {
    return ApiClient.server().post(`/{merchant}/inventory/transfer/save`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 保存并审核
   *
   */
  static saveAndAudit (body: InventoryTransfer): Promise<Response<InventoryTransfer>> {
    return ApiClient.server().post(`/{merchant}/inventory/transfer/saveAndAudit`, body).then((res) => {
      return res.data
    })
  }

  /**
   * 保存并新增
   *
   */
  static saveAndCreate (body: InventoryTransfer): Promise<Response<InventoryTransfer>> {
    return ApiClient.server().post(`/{merchant}/inventory/transfer/saveAndCreate`, body).then((res) => {
      return res.data
    })
  }

}
