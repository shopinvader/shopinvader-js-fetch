"use strict"

import { FetchHeaders } from "./Types";

class HttpErrorResponse extends Error {
  name: string;
  response: any;
  constructor(message = 'Something went wrong', response: any) {
    super(message);
    this.name = 'HttpErrorResponse';
    this.response = response
  }
}

export class ErpFetch {
  baseUrl: string
  websiteKey: string
  _fetch: Function
  /**
   * Fetcher to Odoo Rest API
   * @param {string} baseUrl base URL of the REST API
   * @param {string} websiteKey Website Key
   * @param {object} transport fetch function
   */
  constructor(baseUrl: string, websiteKey: string, transport: Function) {
    this.baseUrl = baseUrl
    this.websiteKey = websiteKey
    this._fetch = transport || fetch
  }

  /** @return true if the headers contains a Content-Type */
  haveContentType(headers: FetchHeaders): boolean {
    return headers !== null
      && headers !== undefined
      && headers?.['Content-Type']?.length > 0
  }

  /** @return true if the headers contains a Content-Type 'application/json' */
  isJsonContentType(headers: FetchHeaders): boolean {
    return this.haveContentType(headers)
      && headers['Content-Type'].indexOf('application/json') > -1
  }

  /** @return true if the body seems like JSON and the Content-type is not set yet. */
  needsDefaultJsonContentType(headers: FetchHeaders, body: any): boolean {
    return !this.haveContentType(headers)
      && body !== null
      && body !== undefined
      && !(body instanceof FormData)    // object but not JSON
      && !(body instanceof Blob)        // object but not JSON
      && !(body instanceof ArrayBuffer) // object but not JSON
      && typeof body !== 'string'     // should be text/plain
      && (typeof body === 'object' || typeof body === 'number' || typeof body === 'boolean') // Ok, json
  }

  /**
   * Make HTTP requests to resource
   * @param {String} resource the resource that you wish to fetch
   * @param {Object} init custom settings that you want to apply to the request (method, headers ...)
   * @param {String} responseType 'blob', 'text', 'json', 'arrayBuffer', 'response' (json is the default)
   * @returns Promise
   */
  fetch(resource: string, init: any = {}, responseType: string = 'json'): Promise<any> {
    init.headers = {
      ...init.headers,
      ...{
        "WEBSITE-UNIQUE-KEY": this.websiteKey,
      },
    }
    if (this.isJsonContentType(init.headers)) {
      init.body = JSON.stringify(init.body)
    }
    const request: Function = this._fetch
    const url: string = new URL(resource, this.baseUrl).href
    return request(url, init).then((response: any) => {
      if (response?.ok) {
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
      } else {
        if(response.status === 400) {
          const message = response?.json()
            .then((data: any) => data?.detail || data?.message || response.statusText)
            .catch(() => response.statusText)
          throw new Error(message)
        }
        throw new HttpErrorResponse('Http failure response for ' + url + ': ' +
          response.status + ' ' + response.statusText, response);
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
  post(resource: string, body: any = {}, init: any = {}, responseType: string = 'json'): Promise<any> {
    if (this.needsDefaultJsonContentType(init?.headers, body)) {
      init.headers = { ...init.headers, ...{ 'Content-Type': 'application/json' } }
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
  put(resource: string, body: any = {}, init: any = {}, responseType: string = 'json'): Promise<any> {
    if (this.needsDefaultJsonContentType(init?.headers, body)) {
      init.headers = { ...init.headers, ...{ 'Content-Type': 'application/json' } }
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
  get(resource: string, query: any, init: any, responseType: string = 'json'): Promise<any> {
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
  delete(resource: string, body: any = {}, init: any = {}, responseType: string = 'json'): Promise<any> {
    if (this.needsDefaultJsonContentType(init?.headers, body)) {
      init.headers = { ...init.headers, ...{ 'Content-Type': 'application/json' } }
    }
    return this.fetch(resource, {
      ...init,
      ...{ body },
      ...{ method: "DELETE" },
    }, responseType)
  }
}