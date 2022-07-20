const { localrpc} = require('../../init')

 /**
   * function to compare block hashes of replay local blockchain and notary data
   */

async function compareHashes(blockID) {

    const chainInfo = await (localrpc.get_info())

    localHeadBlockNum = chainInfo.head_block_num
    localHeadBlockID = chainInfo.head_block_id
    console.log("--------- Replay Finished -----------")
    console.log("\n\nhead_block_num from local blockchain: " , localHeadBlockNum)
    console.log("\nhead_block_id from reconstructed local blockchain:\n" , localHeadBlockID)
    console.log("\nblock_id from notary validated block:\n", blockID)
}

module.exports = { compareHashes }