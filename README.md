# Shopinvader JS

Library to provide a Shopinvader API client support for client-side or server-side applications.
Also fetch Elasticsearch indices to retrieve data used by the Shopinvader API (products and categories)

## Features

- Fetch **Shopinvader Odoo API**
- Support **Elasticsearch** indicies data fetcher

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
import {ErpFetch} from "@shopinvader/fetch"
const erp = new ErpFetch(
  <API URL >,
  <API WEBSITE UNIQUE KEY >
)
/* API Call : Get user addresses*/
erp.get("/addresses").then((addresses) => {
  console.log(addresses)
})
```

## License

[License](./LICENSE)
