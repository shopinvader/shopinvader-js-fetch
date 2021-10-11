"use strict"

class ErpFetch {
  /**
   * Fetcher to Odoo Rest API
   * @param {string} baseUrl base URL of the REST API
   * @param {string} websiteKey Website Key
   * @param {object} transport fetch function
   */
  constructor(baseUrl, websiteKey, transport) {
    this.baseUrl = baseUrl
    this.websiteKey = websiteKey
    this._fetch = transport || fetch
  }
  /**
   * Make HTTP requests to ressource
   * @param {String} ressource the resource that you wish to fetch
   * @param {Object} init custom settings that you want to apply to the request (method, headers ...)
   * @returns Promise
   */
  fetch(ressource, init = {}) {
    init.headers = {
      ...init.headers,
      ...{
        "Content-Type": "application/json",
        "WEBSITE-UNIQUE-KEY": this.websiteKey,
      },
    }
    init.body = JSON.stringify(init.body)
    const request = this._fetch
    const url = [this.baseUrl, ressource]
    return request(url.join("/"), init).then((response) => response.json())
  }

  /**
   * Post Request to the Rest API
   * @param {string} ressource API Endpoint
   * @param {object} body Body parameters
   * @param {object} init custom settings that you want to apply to the request (method, headers ...)
   * @returns Promise
   */
  post(ressource, body = {}, init = {}) {
    return this.fetch(ressource, {
      ...init,
      ...{body},
      ...{method: "POST"},
    })
  }

  /**
   * Post Request to the Rest API
   * @param {string} ressource API Endpoint
   * @param {object} query query string
   * @param {object} init custom settings that you want to apply to the request (method, headers ...)
   * @returns Promise
   */
  get(ressource, query, init) {
    let url = ressource
    if (query === Object) {
      const params = new URLSearchParams(query)
      url += "?" + params.toString()
    }

    return this.fetch(url, {
      ...init,
      ...{method: "GET"},
    })
  }
}
export default ErpFetch
