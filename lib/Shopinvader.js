/**
 * Shopinvader service registry
 */

class Shopinvader {
  constructor() {
    this.erp = {}
    this.search = {}
    this.events = {}
  }
  /**
   * on : bind event
   * @param {*} name event name 
   * @param {*} fn callback function
   */
  on(name, fn) {
    this.events[name] = fn
  }

  /**
   * trigger an event
   * @param {String} name event name
   * @param {Array} args callback args
   * @returns 
   */
  trigger(name, args) {
    if (typeof this.events[name] === 'function') {
      return this.events[name](args) || args
    }
    return args
  }

  /**
   * register a new service
   * @param {Object} service a shopinvader service
   * @returns Shopinvader
   */
  register(service) {
    const $shopinvader = this
    if (
      typeof service === 'object' &&
      service?.namespace !== undefined &&
      service?.name !== undefined
    ) {
      service.registry = this

      // Callbacks on event handler
      service.onRequest((args) => {
        return this.trigger('request:before', service, args)
      })
      service.onResponse((response) => {
        return this.trigger('request:after', service, response)
      })
      service.onError((err) => {
        return this.trigger('error', err)
      })

      // Proxy service registration
      this[service.namespace][service.name] = new Proxy(service, {
        set: () => {
          throw new Error(`${service.name} service is readonly`)
        },
        get: (object, key) => {
          if (typeof object[key] === 'function') {
            return function () {
              const eventName = service.name + ':' + key + ':'
              const args =
                $shopinvader.trigger(eventName + 'before', arguments) ||
                arguments

              const res = object[key](...args)

              return $shopinvader.trigger(eventName + 'after', res)
            }
          } else {
            return object[key]
          }
        },
      })
    } else {
      throw new Error('Service need namespace and name')
    }
    return this
  }
}
export default Shopinvader
