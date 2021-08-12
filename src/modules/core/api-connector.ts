export function APIConnector(method: string, url: string, callback: Function, params?: any) {

  const BASE_URL = 'http://localhost:8443';
  var api = BASE_URL + url;
  console.log('api: ', api)
  
  if (method === 'GET' && params) {
    let url = new URL(window.location.href);
    for (let key of Object.keys(params)) {
      url.searchParams.append(key, params[key]);
    }
    api += url.search;
  }

  // configure request header
  const config: any = {
    method: method,
    mode: 'cors',
    headers: {
      'Accept': '*/*',
      'Content-Type': 'application/json'
    },
    body: (method === 'POST' && params) ? JSON.stringify(params) : null
  }

  fetch(api, config)
    .then((res: any) => res.json())
    .then((processed_res: any) => {
      callback(processed_res)
    })

}