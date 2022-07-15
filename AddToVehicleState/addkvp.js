const { Api, JsonRpc, RpcError, localapi } = require('../init')

/**
  * function to send key-value-pairs as transaction to local blockchain
  */

async function addkvp(actor, source, vehicleId, keys, values) {
  var kvpsObj = {}
  if (typeof keys == 'object') {
    keys.forEach((key, index) => {
      const value = values[index]
      kvpsObj[key] = value
    })
  }
  else {
    kvpsObj[keys] = values
  }
  const kvps = (JSON.stringify(kvpsObj))

  try {
    const response = await localapi.transact({
      actions: [{
        account: 'vehiclestate',
        name: 'addkvp',
        authorization: [{
          actor: actor,
          permission: 'active',
        }],
        data: {
          source: source,
          vehicleId: vehicleId,
          kvps: kvps,
        }
      }]
    },
      {
        blocksBehind: 3,
        expireSeconds: 30,
      }
    )
    console.log("Transaction send successfully")
    console.log(kvps)
  }
  catch (error) {
    if (error instanceof RpcError) {
      console.log(`EOSIO Rpc Error occured:\n${JSON.stringify(error.json, null, 2)}`);
      return { response: null, error: error.json }
    }
    else {
      console.log(`Error occured: ` + error);
      return { response: null, error: error }
    }

  }
}

module.exports = { addkvp }