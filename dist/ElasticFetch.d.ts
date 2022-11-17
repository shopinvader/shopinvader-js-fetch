import { FetchBody, ElasticQueryBody } from './Types';
export declare class ElasticFetch {
    ressource: string;
    _fetch: Function;
    constructor(baseUrl: string, indexName: string, transport: Function);
    /**
     * Make HTTP requests to ressource
     * @param {String} ressource the resource that you wish to fetch
     * @param {Object} init custom settings that you want to apply to the request (method, headers ...)
     * @returns Promise
     */
    fetch_json(init?: FetchBody, ressource?: string): Promise<any>;
    find(field: string, value: string): Promise<any>;
    search(body?: ElasticQueryBody): Promise<any>;
}
