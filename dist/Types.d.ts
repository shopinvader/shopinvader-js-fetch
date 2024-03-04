export interface FetchHeaders {
    'Content-Type'?: any;
    [key: string]: string;
}
export interface FetchBody {
    headers?: FetchHeaders;
    body?: any;
}
export interface ElasticQueryBody {
    query: any;
}
