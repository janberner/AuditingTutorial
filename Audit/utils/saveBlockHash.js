const {  RpcError,  jungleapi} = require('../../init')

const { getChainInfo } = require('./getChainInfo')
const { sendTransaction } = require ('./sendTransaction')
const { getTestnetAccount } = require('../setTestnetAccount')

/**
   * function to save current blockID and timestamp on public blockchain 
   */


async function saveBlockHash() {
    const testnetAccount = getTestnetAccount()
    try {
        // get blockID and timestamp
        const { chainInfo, error } = await getChainInfo();
        if(error) 
            return console.error("Error while reading blockchain info: ", error)
        const hashData = { 
            block_id: chainInfo.head_block_id,
            timestamp: chainInfo.head_block_time
        }
        // create and send transaction to public blockchain
        const { response } = await sendTransaction(
            jungleapi,
            testnetAccount,
            'savehash',
            testnetAccount,
            hashData
        )
        
        if (response.processed) {
            console.log("Block hash saved successfully on testnet")
        } else { 
            console.error("Something went wrong saving hash on testnet")
        }
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

module.exports =  { saveBlockHash }