"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class HttpErrorResponse extends Error {
    constructor(message = 'Something went wrong', response) {
        super(message);
        this.name = 'HttpErrorResponse';
        this.response = response;
    }
}
class ErpFetch {
    /**
     * Fetcher to Odoo Rest API
     * @param {string} baseUrl base URL of the REST API
     * @param {string} websiteKey Website Key
     * @param {object} transport fetch function
     */
    constructor(baseUrl, websiteKey, transport) {
        this.baseUrl = baseUrl;
        this.websiteKey = websiteKey;
        this._fetch = transport || fetch;
    }
    /** @return true if the headers contains a Content-Type */
    haveContentType(headers) {
        var _a;
        return headers !== null
            && headers !== undefined
            && ((_a = headers === null || headers === void 0 ? void 0 : headers['Content-Type']) === null || _a === void 0 ? void 0 : _a.length) > 0;
    }
    /** @return true if the headers contains a Content-Type 'application/json' */
    isJsonContentType(headers) {
        return this.haveContentType(headers)
            && headers['Content-Type'].indexOf('application/json') > -1;
    }
    /** @return true if the body seems like JSON and the Content-type is not set yet. */
    needsDefaultJsonContentType(headers, body) {
        return !this.haveContentType(headers)
            && body !== null
            && body !== undefined
            && !(body instanceof FormData) // object but not JSON
            && !(body instanceof Blob) // object but not JSON
            && !(body instanceof ArrayBuffer) // object but not JSON
            && typeof body !== 'string' // should be text/plain
            && (typeof body === 'object' || typeof body === 'number' || typeof body === 'boolean'); // Ok, json
    }
    /**
     * Make HTTP requests to resource
     * @param {String} resource the resource that you wish to fetch
     * @param {Object} init custom settings that you want to apply to the request (method, headers ...)
     * @param {String} responseType 'blob', 'text', 'json', 'arrayBuffer', 'response' (json is the default)
     * @returns Promise
     */
    fetch(resource, init = {}, responseType = 'json') {
        init.headers = Object.assign(Object.assign({}, init.headers), {
            "WEBSITE-UNIQUE-KEY": this.websiteKey,
        });
        if (this.isJsonContentType(init.headers)) {
            init.body = JSON.stringify(init.body);
        }
        const request = this._fetch;
        const url = new URL(resource, this.baseUrl).href;
        return request(url, init).then((response) => {
            if (response === null || response === void 0 ? void 0 : response.ok) {
                if (responseType === 'blob') {
                    return response.blob();
                }
                else if (responseType === 'text') {
                    return response.text();
                }
                else if (responseType === 'arrayBuffer') {
                    return response.arrayBuffer();
                }
                else if (responseType === 'json') {
                    return response.json();
                }
                else {
                    return response;
                }
            }
            else {
                throw new HttpErrorResponse('Http failure response for ' + url + ': ' +
                    response.status + ' ' + response.statusText, response);
            }
        });
    }
    /**
     * Post Request to the Rest API
     * @param {string} resource API Endpoint
     * @param {object} body Body parameters
     * @param {object} init custom settings that you want to apply to the request (method, headers ...)
     * @param {String} responseType 'blob', 'text', 'json', 'arrayBuffer', 'response' (json is the default)
     * @returns Promise
     */
    post(resource, body = {}, init = {}, responseType = 'json') {
        if (this.needsDefaultJsonContentType(init === null || init === void 0 ? void 0 : init.headers, body)) {
            init.headers = Object.assign(Object.assign({}, init.headers), { 'Content-Type': 'application/json' });
        }
        return this.fetch(resource, Object.assign(Object.assign(Object.assign({}, init), { body }), { method: "POST" }), responseType);
    }
    /**
     * Put Request to the Rest API
     * @param {string} resource API Endpoint
     * @param {object} body Body parameters
     * @param {object} init custom settings that you want to apply to the request (headers ...)
     * @param {String} responseType 'blob', 'text', 'json', 'arrayBuffer', 'response' (json is the default)
     * @returns Promise
     */
    put(resource, body = {}, init = {}, responseType = 'json') {
        if (this.needsDefaultJsonContentType(init === null || init === void 0 ? void 0 : init.headers, body)) {
            init.headers = Object.assign(Object.assign({}, init.headers), { 'Content-Type': 'application/json' });
        }
        return this.fetch(resource, Object.assign(Object.assign(Object.assign({}, init), { body }), { method: "PUT" }), responseType);
    }
    /**
     * Post Request to the Rest API
     * @param {string} resource API Endpoint
     * @param {object} query query string
     * @param {object} init custom settings that you want to apply to the request (headers ...)
     * @param {String} responseType 'blob', 'text', 'json', 'arrayBuffer', 'response' (json is the default)
     * @returns Promise
     */
    get(resource, query, init, responseType = 'json') {
        let url = resource;
        if (typeof query === 'object') {
            const params = new URLSearchParams(query);
            /** Search for Array parameters and split them into duplicate entries */
            for (const [key, value] of Object.entries(query)) {
                if (Array.isArray(value)) {
                    params.delete(key);
                    value.forEach((v) => params.append(key, v));
                }
            }
            url += "?" + params.toString();
        }
        return this.fetch(url, Object.assign(Object.assign({}, init), { method: "GET" }), responseType);
    }
    /**
     * Delete Request to the Rest API
     * @param {string} resource API Endpoint
     * @param {object} query query string
     * @param {object} init custom settings that you want to apply to the request (headers ...)
     * @param {String} responseType 'blob', 'text', 'json', 'arrayBuffer', 'response' (json is the default)
     * @returns Promise
     */
    delete(resource, body = {}, init = {}, responseType = 'json') {
        if (this.needsDefaultJsonContentType(init === null || init === void 0 ? void 0 : init.headers, body)) {
            init.headers = Object.assign(Object.assign({}, init.headers), { 'Content-Type': 'application/json' });
        }
        return this.fetch(resource, Object.assign(Object.assign(Object.assign({}, init), { body }), { method: "DELETE" }), responseType);
    }
}
exports.ErpFetch = ErpFetch;
