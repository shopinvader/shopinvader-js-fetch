import { FetchBody, ElasticQueryBody } from './Types'

export class ElasticFetch {
  ressource: string
  _fetch: Function
  constructor(baseUrl: string, indexName: string, transport: Function) {
    this.ressource = [baseUrl, indexName].join("/")
    this._fetch = transport || fetch
  }

  /**
   * Make HTTP requests to ressource
   * @param {String} ressource the resource that you wish to fetch
   * @param {Object} init custom settings that you want to apply to the request (method, headers ...)
   * @returns Promise
   */
  fetch_json(init: FetchBody = {}, ressource: string = "_search"): Promise<any> {
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
    return request(url.join("/"), init).then((response: any) => response?.json() || {})
  }

  find(field: string, value: string): Promise<any> {
    const terms: any = {}
    terms[field] = [value]
    return this.search({
      query: {
        terms,
      },
    })
  }

  search(
    body: ElasticQueryBody = {
      query: {
        match_all: {},
      },
    }
  ): Promise<any> {
    return this.fetch_json({
      body,
    })
  }
}
