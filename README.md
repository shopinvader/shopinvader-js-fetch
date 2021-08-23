# Shopinvader JS

Library to provide a Shopinvader API client support for client-side or server-side applications.
Also fetch Elasticsearch indices to retrieve data used by the Shopinvader API (products and categories)

## Features

- Fetch **Shopinvader Odoo API **
- Support **Elasticsearch** indicies data fetcher
- **Events**

## Getting started

### Installation

#### NPM

[TODO] Need a registration to NPM
`npm install shopinvader-js --save`

#### YARN

[TODO] Need a registration to NPM
`yarn add shopinvader-js`

## Usage

```javascript
import {Shopinvader} from "shopinvader-js"
const option = {
  url: <YOUR API URL>,
  headers: { website_key: <YOUR WEBSITE KEY> },
}

const shopinvader = new Shopinvader()
```

### Register a service

#### ERP Service

To register an ERP search service on your shopinvader services redistry :

```javascript
import {ErpService} from "shopinvader-js"
shopinvader.register(new ErpService("sales", option))
```

#### Elastic Search Service

To register an elastic search service on your shopinvader services redistry :

```javascript
import {ElasticService} from "shopinvader-js"
shopinvader.register(new ElasticService('product', {
  url: <YOUR ELASTIC SEARCH URL>,
  index: <YOUR ELASTIC INDEX>,
  body: <CUSTOM QUERY BODY PARAMETERS>,
}))
```

### Create a service

Service class needs to extends a service class like

- Shopinvader.Service
- Shopinvader.ErpService (extended from Shopinvader.Service)
- Shopinvader.ElasticService (extended from Shopinvader.Service)

A service need to have namespace attribute. Use Service.fetch to retrieve data

Example

```javascript
// service declaration
class MyService extends ErpService {
  namespace = "erp"
  constructor(name, config) {
    super(name, config)
  }
  get(endpoint, params) {
    return this.fetch("<Service Endpoint>", {})
  }
}

//service registration

shopinvader.register(new MyService("myservice", {}))
```

## Get data

### Get Erp Data

Example

```javascript
shopinvader.erp.cart.get().then((data) => console.log(data))
```

### Get Elastic Data

Example

```javascript
shopinvader.search.product.find({id: 12345}).then((data) => console.log(data))
```

## Events

### global Events

#### on Request

```javascript
shopinvader.on("request:before", (service, args) => {
  console.log(`Request called on a registred service with arguments ${args} !`)
})
```

#### on Response

```javascript
shopinvader.on("request:after", (service, data) => {
  console.log(`data retrieved ${data} from ${service.name} !`)
})
```

### Service Events

#### on Request

```javascript
shopinvader.on("sales:get:before", (service, args) => {
  console.log(`called before getting sales !`)
})
```

### Authentication

To supply Authorization token use _request:before_ event

Exemple

```javascript
shopinvader.on("request:before", (service, args) => {
  if (service.namespace === "erp") {
    service.setAuthorization("< MY TOKEN >")
  }
})
```
