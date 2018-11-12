import ApiClient from 'http/ApiClient'
import Response from 'model/response/Response'

export default class ExcelApi {
  static importAccountCategory (uuid: string): Promise<Response<string>> {
    return ApiClient.server().get(`{merchant}/excel/accountCategory/import`, {
      params: {
        uuid: uuid
      }
    }).then((res) => {
      return res.data
    })
  }

  static importAdvancePayment (uuid: string): Promise<Response<string>> {
    return ApiClient.server().get(`{merchant}/excel/advancePayment/import`, {
      params: {
        uuid: uuid
      }
    }).then((res) => {
      return res.data
    })
  }

  static importCharge (uuid: string): Promise<Response<string>> {
    return ApiClient.server().get(`{merchant}/excel/charge/import`, {
      params: {
        uuid: uuid
      }
    }).then((res) => {
      return res.data
    })
  }

  static importCheckInventory (uuid: string): Promise<Response<string>> {
    return ApiClient.server().get(`{merchant}/excel/checkInventory/import`, {
      params: {
        uuid: uuid
      }
    }).then((res) => {
      return res.data
    })
  }

  static importCustomer (uuid: string): Promise<Response<string>> {
    return ApiClient.server().get(`{merchant}/excel/customer/import`, {
      params: {
        uuid: uuid
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 期初库存-导入
   *
   */
  static importInventoryBegining (uuid: string): Promise<Response<void>> {
    return ApiClient.server().get(`{merchant}/excel/inventory/begining/import`, {
      params: {
        uuid: uuid
      }
    }).then((res) => {
      return res.data
    })
  }

  static importInventoryTransfer (uuid: string): Promise<Response<string>> {
    return ApiClient.server().get(`{merchant}/excel/inventoryTransfer/import`, {
      params: {
        uuid: uuid
      }
    }).then((res) => {
      return res.data
    })
  }

  static importLogisticsCompany (uuid: string): Promise<Response<string>> {
    return ApiClient.server().get(`{merchant}/excel/logisticsCompany/import`, {
      params: {
        uuid: uuid
      }
    }).then((res) => {
      return res.data
    })
  }

  static importPurchaseGroup (uuid: string): Promise<Response<string>> {
    return ApiClient.server().get(`{merchant}/excel/purchaseGroup/import`, {
      params: {
        uuid: uuid
      }
    }).then((res) => {
      return res.data
    })
  }

  static importSale (uuid: string): Promise<Response<string>> {
    return ApiClient.server().get(`{merchant}/excel/sale/import`, {
      params: {
        uuid: uuid
      }
    }).then((res) => {
      return res.data
    })
  }

  static importSaleReturn (uuid: string): Promise<Response<void>> {
    return ApiClient.server().get(`{merchant}/excel/salereturn/import`, {
      params: {
        uuid: uuid
      }
    }).then((res) => {
      return res.data
    })
  }

  static importSku (uuid: string): Promise<Response<string>> {
    return ApiClient.server().get(`{merchant}/excel/sku/import`, {
      params: {
        uuid: uuid
      }
    }).then((res) => {
      return res.data
    })
  }

  static importSkuCategory (uuid: string): Promise<Response<string>> {
    return ApiClient.server().get(`{merchant}/excel/skuCategory/import`, {
      params: {
        uuid: uuid
      }
    }).then((res) => {
      return res.data
    })
  }

  static importSupplier (uuid: string): Promise<Response<string>> {
    return ApiClient.server().get(`{merchant}/excel/supplier/import`, {
      params: {
        uuid: uuid
      }
    }).then((res) => {
      return res.data
    })
  }

  static importSupplierStatement (uuid: string): Promise<Response<string>> {
    return ApiClient.server().get(`{merchant}/excel/supplierStatement/import`, {
      params: {
        uuid: uuid
      }
    }).then((res) => {
      return res.data
    })
  }

  static importUser (uuid: string): Promise<Response<string>> {
    return ApiClient.server().get(`{merchant}/excel/user/import`, {
      params: {
        uuid: uuid
      }
    }).then((res) => {
      return res.data
    })
  }

  static importWarehouse (uuid: string): Promise<Response<string>> {
    return ApiClient.server().get(`{merchant}/excel/warehouse/import`, {
      params: {
        uuid: uuid
      }
    }).then((res) => {
      return res.data
    })
  }

  static interrupt (name: string): Promise<Response<void>> {
    return ApiClient.server().get(`{merchant}/excel/interrupt`, {
      params: {
        name: name
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 获取导入模板
   *
   */
  static listTemplate (type: string): Promise<Response<string[]>> {
    return ApiClient.server().get(`{merchant}/excel/template/list`, {
      params: {
        type: type
      }
    }).then((res) => {
      return res.data
    })
  }

  static purchaseBeginImport (uuid: string): Promise<Response<string>> {
    return ApiClient.server().get(`{merchant}/excel/purchaseBeginImport`, {
      params: {
        uuid: uuid
      }
    }).then((res) => {
      return res.data
    })
  }

  static purchaseReturnBeginImport (uuid: string): Promise<Response<void>> {
    return ApiClient.server().get(`{merchant}/excel/purchaseReturnBeginImport`, {
      params: {
        uuid: uuid
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 上传导入文件
   *
   */
  static upload (file: any): Promise<Response<string>> {
    let body = new FormData()
    body.append('file', file)
    return ApiClient.server().post(`{merchant}/excel/upload`, body).then((res) => {
      return res.data
    })
  }

}
