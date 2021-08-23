import Service from './Service'

/**
 * Shopinvader Elastic Search service
 */
class ElasticService extends Service {
  namespace = 'search'
  constructor(name, config) {
    super(name, config)
    this.url = config.url
  }

  find(params, size = 30) {
    const requestParams = {
      size: 20,
    }
    if (params != null) {
      requestParams.query = {
        terms: params,
      }
    }
    return this.search(requestParams).then((response) => {
      return response.hits
    })
  }

  findById(id) {
    return this.search({
      query: {
        terms: {
          _id: [id],
        },
      },
    })
  }

  search(body) {
    body = { ...body, ...this.config.body }
    let hits = []
    return this.request(body).then((response) => {
      if (
        response !== undefined &&
        response.hits !== undefined &&
        response.hits.hits !== undefined
      ) {
        hits = response.hits.hits.map((item) => {
          const innerHits = {}
          if (item.inner_hits !== undefined) {
            Object.keys(item.inner_hits).map((innerKey) => {
              innerHits[innerKey] = item.inner_hits[innerKey].hits.hits.map(
                (hit) => hit._source
              )
            })
          }
          return { ...item._source, ...innerHits }
        })
      } else {
        response = {
          total: 0,
          aggregations: [],
        }
      }
      return {
        // total: response.hits.total.value,
        hits,
        aggregations: response.aggregations,
      }
    })
  }

  request(body = {}) {
    // [TODO] = Have to use user local
    const index = this.config.index + '_fr_fr/_search'
    return this.fetch(index, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  }
}
export default ElasticService
