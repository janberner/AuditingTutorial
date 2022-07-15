const { Api, JsonRpc , RpcError, localrpc} = require('../../init')

 /**
   * function compares local head block number with replay target block number
   */

async function compareHeadNum(block_num) {

    const chainInfo = await (localrpc.get_info())

    localHeadBlockNum = chainInfo.head_block_num
    localHeadBlockID = chainInfo.head_block_id

    if (localHeadBlockNum == block_num) {
        return true 
    }
    else {
        return false
    }
}

module.exports = { compareHeadNum }