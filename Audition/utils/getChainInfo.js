const { Api, JsonRpc , RpcError, localrpc} = require('../../init')

async function getChainInfo() {

    try {
        const chainInfo = await localrpc.get_info();
        return { chainInfo, error: null}

    } catch(error){
        if (error instanceof RpcError) {
            console.error(`RPC Error: ${error}`)
        } 
        else { 
            console.error(`ERROR occured while reading chain info`)

        }
        return { chainInfo: null, error: error}
    }
}

module.exports = {
    getChainInfo
}