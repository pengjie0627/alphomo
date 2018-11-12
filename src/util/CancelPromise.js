export default class CancelPromise {

  constructor(promise) {
    this.promise = promise.then((resp) => {
      if (this.cancelled) {
        return null
      }
      return resp
    })
  }

  cancel() {
    this.cancelled = true
  }

  then(callback) {
    return this.promise.then(callback)
  }

  catch(callback) {
    return this.promise.catch(callback)
  }
}
