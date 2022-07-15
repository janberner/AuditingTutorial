const { RpcError, localrpc } = require('../../init')

 /**
   * function to find block number of the nearest notarized block 
   */

async function getBlockNum(block_id) {
    console.log('\nFind the block number of the validated block on source chain')
    console.log(typeof block_id)
    try {
        const blockInfo = await localrpc.get_block(block_id)
        console.log('Block number: ' + blockInfo.block_num, '\n')
        block_num = blockInfo.block_num
        return block_num
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

module.exports = { getBlockNum }