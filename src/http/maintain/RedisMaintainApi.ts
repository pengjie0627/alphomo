import ApiClient from 'http/ApiClient'

export default class RedisMaintainApi {
  static syncUser (): Promise<void> {
    return ApiClient.server().get(``).then((res) => {
      return res.data
    })
  }

}
