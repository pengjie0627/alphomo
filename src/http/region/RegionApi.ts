import ApiClient from 'http/ApiClient'
import Response from 'model/response/Response'
import Region from 'model/region/Region'

export default class RegionApi {
  /**
   * 查询
   *
   * @param level 地区级别, province、city、district、street
   * @param parentCode 上一级编码
   */
  static queryAddress (level: string, parentCode: string): Promise<Response<Region[]>> {
    return ApiClient.server().get(`/{merchant}/region/query`, {
      params: {
        level: level,
        parentCode: parentCode
      }
    }).then((res) => {
      return res.data
    })
  }

}
