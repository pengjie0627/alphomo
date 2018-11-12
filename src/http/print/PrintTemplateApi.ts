import ApiClient from 'http/ApiClient'
import Response from 'model/response/Response'
import PrintTemplate from 'model/print/PrintTemplate'

export default class PrintTemplateApi {
  /**
   * 获取打印模板
   *
   */
  static get (type: string): Promise<Response<PrintTemplate>> {
    return ApiClient.server().get(`/{merchant}/templatePrint/get/template`, {
      params: {
        type: type
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 获取打印数据
   *
   */
  static getSalePrintData (uuid: string): Promise<Response<PrintTemplate>> {
    return ApiClient.server().get(`/{merchant}/templatePrint/get/data/sale`, {
      params: {
        uuid: uuid
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 获取打印数据
   *
   */
  static printSaleDetail (id: string): Promise<Response<string>> {
    return ApiClient.server().get(`/{merchant}/templatePrint/sale/detail/print`, {
      params: {
        id: id
      }
    }).then((res) => {
      return res.data
    })
  }

  /**
   * 保存
   *
   */
  static save (body: PrintTemplate): Promise<Response<PrintTemplate>> {
    return ApiClient.server().post(`/{merchant}/templatePrint/save`, body).then((res) => {
      return res.data
    })
  }

}
