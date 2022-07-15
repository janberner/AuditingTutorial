const { RpcError } =require('../../init');
const { createTransaction } = require('./createTransaction');

 /**
   * function to create and send transaction to public blockchain
   */
async function sendTransaction(jungleapi, contractAccount, actionName, actor, data) { 

    try {
        // brings data in transaction format 
        const transaction = createTransaction(contractAccount, actionName, actor, data)
        const options = { blocksBehind: 3, expireSeconds: 300}
        const response = await jungleapi.transact(transaction, options)
        console.log("Transaction send successfully")
        return { response: response, console: null }
    }
    catch(error) {
        if (error instanceof RpcError) {
            console.log(`EOSIO Rpc Error occured:\n${JSON.stringify(error.json, null, 2)}`);
            return { response: null , error: error.json }
        }
        else { 
            console.log(`Error occured: ` + error);
            return { response: null , error: error }
        }
        
    }
}

module.exports = { sendTransaction }