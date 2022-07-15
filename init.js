const { Api, JsonRpc , RpcError} = require('eosjs')
const fetch = require('node-fetch')  

const { JsSignatureProvider } = require('eosjs/dist/eosjs-jssig.js')


defaultPrivateKey = [
    "5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3" // private development key
]
  
const signatureProvider = new JsSignatureProvider(defaultPrivateKey);

const localrpc = new JsonRpc('http://127.0.0.1:8888', { fetch }); //required to read blockchain state
const localapi = new Api({ rpc: localrpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() }); //required to submit transactions
  
const junglerpc = new JsonRpc('http://jungle3.cryptolions.io:8888', { fetch }); //required to read blockchain state
const jungleapi = new Api({ rpc: junglerpc, signatureProvider, textDecoder: new TextDecoder(), textEncoder: new TextEncoder() }); //required to submit transactions



module.exports = {
    Api,
    JsonRpc,
    RpcError,
    localrpc,
    localapi,
    junglerpc,
    jungleapi
}
