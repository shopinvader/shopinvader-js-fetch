"use strict"

export class ElasticFetch {
  constructor(baseUrl, indexName, transport) {
    this.ressource = [baseUrl, indexName].join("/")
    this._fetch = transport || fetch
  }

  /**
   * Make HTTP requests to ressource
   * @param {String} ressource the resource that you wish to fetch
   * @param {Object} init custom settings that you want to apply to the request (method, headers ...)
   * @returns Promise
   */
  fetch_json(init = {}, ressource = "_search") {
    init.headers = {
      ...init.headers,
      ...{
        "Content-Type": "application/json",
      },
    }
    init = {
      ...init,
      ...{
        method: "POST",
        body: JSON.stringify(init.body),
      },
    }
    const request = this._fetch
    const url = [this.ressource, ressource]
    return request(url.join("/"), init).then((response) => response.json())
  }

  find(field, value) {
    const terms = {}
    terms[field] = [value]
    return this.search({
      query: {
        terms,
      },
    })
  }

  search(
    body = {
      query: {
        match_all: {},
      },
    }
  ) {
    return this.fetch_json({
      body,
    })
  }
}
