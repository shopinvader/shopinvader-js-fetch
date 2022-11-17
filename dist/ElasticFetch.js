"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ElasticFetch {
    constructor(baseUrl, indexName, transport) {
        this.ressource = [baseUrl, indexName].join("/");
        this._fetch = transport || fetch;
    }
    /**
     * Make HTTP requests to ressource
     * @param {String} ressource the resource that you wish to fetch
     * @param {Object} init custom settings that you want to apply to the request (method, headers ...)
     * @returns Promise
     */
    fetch_json(init = {}, ressource = "_search") {
        init.headers = Object.assign(Object.assign({}, init.headers), {
            "Content-Type": "application/json",
        });
        init = Object.assign(Object.assign({}, init), {
            method: "POST",
            body: JSON.stringify(init.body),
        });
        const request = this._fetch;
        const url = [this.ressource, ressource];
        return request(url.join("/"), init).then((response) => (response === null || response === void 0 ? void 0 : response.json()) || {});
    }
    find(field, value) {
        const terms = {};
        terms[field] = [value];
        return this.search({
            query: {
                terms,
            },
        });
    }
    search(body = {
        query: {
            match_all: {},
        },
    }) {
        return this.fetch_json({
            body,
        });
    }
}
exports.ElasticFetch = ElasticFetch;
