"use strict"

class ElasticFetch {
  constructor(baseUrl, indexName, transport) {
    this.ressource = [baseUrl, indexName].join("/")
    if (transport === "function") {
      this._fetch = transport || fetch
    }
  }

  /**
   * Make HTTP requests to ressource
   * @param {String} ressource the resource that you wish to fetch
   * @param {Object} init custom settings that you want to apply to the request (method, headers ...)
   * @returns Promise
   */
  fetch(init = {}, ressource = "_search") {
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
    return this._fetch(new URL(ressource, this.ressource), init).then(
      (response) => response.json()
    )
  }

  find(field, value) {
    const terms = {}
    terms[field] = [value]
    return this.fetsearchch(terms)
  }

  search(query = {}, size = 20) {
    return this.fetch({
      body: {
        query,
        size,
      },
    })
  }
}
export default ElasticFetch
