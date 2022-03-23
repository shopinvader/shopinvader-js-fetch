"use strict"

export class ErpFetch {
  /**
   * Fetcher to Odoo Rest API
   * @param {string} baseUrl base URL of the REST API
   * @param {string} websiteKey Website Key
   * @param {object} transport fetch function
   */
  constructor (baseUrl, websiteKey, transport) {
    this.baseUrl = baseUrl
    this.websiteKey = websiteKey
    this._fetch = transport || fetch
  }
  /**
   * Make HTTP requests to resource
   * @param {String} resource the resource that you wish to fetch
   * @param {Object} init custom settings that you want to apply to the request (method, headers ...)
   * @param {String} responseType 'blob', 'text', 'json', 'arrayBuffer', 'response' (json is the default)
   * @returns Promise
   */
  fetch (resource, init = {}, responseType = 'json') {
    init.headers = {
      ...init.headers,
      ...{
        "WEBSITE-UNIQUE-KEY": this.websiteKey,
      },
    }
    init.body = JSON.stringify(init.body)
    const request = this._fetch
    const url = [this.baseUrl, resource]
    return request(url.join("/"), init).then((response) => {
      if (responseType === 'blob') {
        return response.blob()
      } else if (responseType === 'text') {
        return response.text()
      } else if (responseType === 'arrayBuffer') {
        return response.arrayBuffer()
      } else if (responseType === 'json') {
        return response.json()
      } else {
        return response;
      }
    })
  }

  /**
   * Post Request to the Rest API
   * @param {string} resource API Endpoint
   * @param {object} body Body parameters
   * @param {object} init custom settings that you want to apply to the request (method, headers ...)
   * @param {String} responseType 'blob', 'text', 'json', 'arrayBuffer', 'response' (json is the default)
   * @returns Promise
   */
  post (resource, body = {}, init = {}, responseType = 'json') {
    init.headers = {
      ...init.headers,
      ...{
        "Content-Type": "application/json",
      },
    }
    return this.fetch(resource, {
      ...init,
      ...{ body },
      ...{ method: "POST" }
    }, responseType)
  }

  /**
   * Put Request to the Rest API
   * @param {string} resource API Endpoint
   * @param {object} body Body parameters
   * @param {object} init custom settings that you want to apply to the request (headers ...)
   * @param {String} responseType 'blob', 'text', 'json', 'arrayBuffer', 'response' (json is the default)
   * @returns Promise
   */
  put (resource, body = {}, init = {}, responseType = 'json') {
    init.headers = {
      ...init.headers,
      ...{
        "Content-Type": "application/json",
      },
    }
    return this.fetch(resource, {
      ...init,
      ...{ body },
      ...{ method: "PUT" }
    }, responseType)
  }

  /**
   * Post Request to the Rest API
   * @param {string} resource API Endpoint
   * @param {object} query query string
   * @param {object} init custom settings that you want to apply to the request (headers ...)
   * @param {String} responseType 'blob', 'text', 'json', 'arrayBuffer', 'response' (json is the default)
   * @returns Promise
   */
  get (resource, query, init, responseType = 'json') {
    let url = resource
    if (typeof query === 'object') {
      const params = new URLSearchParams(query)
      /** Search for Array parameters and split them into duplicate entries */
      for (const [key, value] of Object.entries(query)) {
        if (Array.isArray(value)) {
          params.delete(key);
          value.forEach((v) => params.append(key, v));
        }
      }
      url += "?" + params.toString()
    }
    return this.fetch(url, {
      ...init,
      ...{ method: "GET" },
    }, responseType)
  }
  /**
   * Delete Request to the Rest API
   * @param {string} resource API Endpoint
   * @param {object} query query string
   * @param {object} init custom settings that you want to apply to the request (headers ...)
   * @param {String} responseType 'blob', 'text', 'json', 'arrayBuffer', 'response' (json is the default)
   * @returns Promise
   */
  delete (resource, body = {}, init = {}, responseType = 'json') {
    init.headers = {
      ...init.headers,
      ...{
        "Content-Type": "application/json",
      },
    }
    return this.fetch(resource, {
      ...init,
      ...{ body },
      ...{ method: "DELETE" },
    }, responseType)
  }
}
