import ApiClient from 'http/ApiClient'
import Response from 'model/response/Response'
import OssImage from 'model/image/OssImage'
import OssResult from 'model/image/OssResult'

export default class ImageApi {
  /**
   * 图片上传
   *
   */
  static fileUpload (body: OssImage): Promise<Response<OssResult>> {
    return ApiClient.server().post(`{merchant}/image/upload`, body).then((res) => {
      return res.data
    })
  }

}
