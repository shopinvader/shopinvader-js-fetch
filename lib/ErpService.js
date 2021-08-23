import Service from './Service'

/**
 * Shopinvader ERP API service
 */
class ErpService extends Service {
  namespace = 'erp'
  constructor(name, config) {
    super(name, config)
    this.url = config.url
  }

  setName(name, usage) {
    super.setName(name, usage)
    return this
  }

  get(endpoint, params) {
    return this.call('get', endpoint || '', params || {})
  }

  post(endpoint, params) {
    return this.call('post', endpoint, params)
  }

  call(method, endpoint, query) {
    method = method.toLowerCase()
    let body = null
    if (method === 'get') {
      query = Object.entries(query)
        .map(([key, value]) => encodeURIComponent()`${key}=${value}`)
        .join('&')
      endpoint = query !== '' ? endpoint + '?' + query : endpoint
    } else {
      body = JSON.stringify(query)
    }
    return this.fetch(this.name + '/' + endpoint, {
      header: {},
      method,
      body,
    })
  }
}
export default ErpService
