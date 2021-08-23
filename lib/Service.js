/**
 * Shopinvader service
 */
class Service {
  namespace = 'erp'
  constructor(name, config) {
    this.name = name
    this.url = config.url || ''
    this.headers = config.headers || {}
    this.config = config || {}
    this.registry = null
    this.interceptor = {
      request: null,
      response: null,
      error: null,
    }
  }

  setConfig(config) {
    this.config = { ...this.config, ...config }
  }

  setHeader(name, value) {
    const config = {}
    config[name] = value
    this.headers = {
      ...this.headers,
      ...config,
    }
  }

  setAuthorization(token) {
    this.setHeader('Authorization', token)
  }
  /**
   * API fetcher
   * @param {String} endpoint 
   * @param {Object} options fetch query object
   * @returns {Promise}
   */
  fetch(endpoint, options) {
    const url = [this.url, endpoint].join('/')

    if (typeof this.interceptor.request === 'function') {
      options = this.interceptor.request(options)
    }
    options.headers = { ...options.headers, ...this.headers }
    return fetch(url, options)
      .then((res) => {
        return res.json()
      })
      .then((data) => {
        if (typeof this.interceptor.reponse === 'function') {
          return this.interceptor.request(data)
        }
        return data
      })
      .catch((err) => {
        if (typeof this.interceptor.error === 'function') {
          this.interceptor.error(err)
        } else {
          return new Error(err)
        }
      })
  }

  onRequest(fn) {
    this.interceptor.request = fn
  }

  onError(fn) {
    this.interceptor.error = fn
  }

  onResponse(fn) {
    this.interceptor.response = fn
  }
}
export default Service
