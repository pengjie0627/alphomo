import ApiClient from 'http/ApiClient'
import Response from 'model/response/Response'
import JobProgress from 'model/excel/JobProgress'

export default class JobQueryApi {
  static query (name: string): Promise<Response<JobProgress>> {
    return ApiClient.server().get(`{merchant}/job/query/progress`, {
      params: {
        name: name
      }
    }).then((res) => {
      return res.data
    })
  }

}
