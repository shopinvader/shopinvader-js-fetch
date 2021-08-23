class Shopinvader {
  constructor() {
    this.erp = {}
    this.search = {}
    this.events = {}
  }

  on(name, fn) {
    this.events[name] = fn
  }

  trigger(name, args, service) {
    if (typeof this.events[name] === 'function') {
      return this.events[name](args, service) || args
    }
    return args
  }

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
        return this.trigger('request:before', args, service)
      })
      service.onResponse((response) => {
        return this.trigger('request:after', response, service)
      })
      service.onError((err) => {
        return this.trigger('error', err)
      })
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
