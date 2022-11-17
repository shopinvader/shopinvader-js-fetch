import { FetchHeaders } from "./Types";
export declare class ErpFetch {
    baseUrl: string;
    websiteKey: string;
    _fetch: Function;
    /**
     * Fetcher to Odoo Rest API
     * @param {string} baseUrl base URL of the REST API
     * @param {string} websiteKey Website Key
     * @param {object} transport fetch function
     */
    constructor(baseUrl: string, websiteKey: string, transport: Function);
    /** @return true if the headers contains a Content-Type */
    haveContentType(headers: FetchHeaders): boolean;
    /** @return true if the headers contains a Content-Type 'application/json' */
    isJsonContentType(headers: FetchHeaders): boolean;
    /** @return true if the body seems like JSON and the Content-type is not set yet. */
    needsDefaultJsonContentType(headers: FetchHeaders, body: any): boolean;
    /**
     * Make HTTP requests to resource
     * @param {String} resource the resource that you wish to fetch
     * @param {Object} init custom settings that you want to apply to the request (method, headers ...)
     * @param {String} responseType 'blob', 'text', 'json', 'arrayBuffer', 'response' (json is the default)
     * @returns Promise
     */
    fetch(resource: string, init?: any, responseType?: string): Promise<any>;
    /**
     * Post Request to the Rest API
     * @param {string} resource API Endpoint
     * @param {object} body Body parameters
     * @param {object} init custom settings that you want to apply to the request (method, headers ...)
     * @param {String} responseType 'blob', 'text', 'json', 'arrayBuffer', 'response' (json is the default)
     * @returns Promise
     */
    post(resource: string, body?: any, init?: any, responseType?: string): Promise<any>;
    /**
     * Put Request to the Rest API
     * @param {string} resource API Endpoint
     * @param {object} body Body parameters
     * @param {object} init custom settings that you want to apply to the request (headers ...)
     * @param {String} responseType 'blob', 'text', 'json', 'arrayBuffer', 'response' (json is the default)
     * @returns Promise
     */
    put(resource: string, body?: any, init?: any, responseType?: string): Promise<any>;
    /**
     * Post Request to the Rest API
     * @param {string} resource API Endpoint
     * @param {object} query query string
     * @param {object} init custom settings that you want to apply to the request (headers ...)
     * @param {String} responseType 'blob', 'text', 'json', 'arrayBuffer', 'response' (json is the default)
     * @returns Promise
     */
    get(resource: string, query: any, init: any, responseType?: string): Promise<any>;
    /**
     * Delete Request to the Rest API
     * @param {string} resource API Endpoint
     * @param {object} query query string
     * @param {object} init custom settings that you want to apply to the request (headers ...)
     * @param {String} responseType 'blob', 'text', 'json', 'arrayBuffer', 'response' (json is the default)
     * @returns Promise
     */
    delete(resource: string, body?: any, init?: any, responseType?: string): Promise<any>;
}
