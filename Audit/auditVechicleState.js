
const { getSourceVecState } = require('./utils/getSourceVecState') 
const { getNearestBlockID } = require('./utils/getNearestBlockID')
const { getBlockNum } = require('./utils/getBlockNum')
const { trimBlockLog } = require('./utils/trimBlockLog')
const { backupChainData } = require('./utils/backupChainData')
const { replayBlocklog } = require('./utils/replayBlocklog')
const { getNewVecState } = require('./utils/getNewVecState')
const { getTimestamp } = require('./utils/getTimestamp')
const { nodeosRunning } = require('./utils/nodeosRunning')
const { compareHashes } = require('./utils/compareHashes')
const { compareHeadNum } = require('./utils/compareHeadNum')

async function auditVechicleState() {

    // select a vehicleID that you populated
    vehicleID = 'auditvec1'

    // reads the vehicle state table of the local blockchain and saves it as json file in /data folder
    await getSourceVecState(vehicleID)

    // insert time for which you want to check the state of the vehicle
    timeOfInterest = '2022-01-01T10:10:10.000'    
                //     yyyy-mm-ddThh:mm:ss.mms


    // takes timestamp and transforms it into milliseconds 
    const timeStamp = await getTimestamp(timeOfInterest)
    

    // takes timestamp in millisecond and returns blockID of nearest notarized block from public blockchain 
    const blockID = await getNearestBlockID(timeStamp) 


    // return block number of nearest block from local blockchain
    const blockNum = await getBlockNum(blockID)

    // check if local blockchain is already at nearest notarized block, if so stop audition 
    const beenReplayed = await compareHeadNum(blockNum)

    if (beenReplayed) {
        console.log("Headblock number of local blockchai is same as number of notary validated block number.\n Audition was canceled!")
        return
    }

    // create backup from local blockchain data, so it can later be restored. Backup is only created if none exists! 
    await backupChainData()

    // use eosio-blocklog CLI to trimm blocks.log file to given block number
    await trimBlockLog(blockNum)

    // replay available blocks.log on local machine
    await replayBlocklog()

    // check is replay is finished
    await nodeosRunning()

    // read vehicle state after replay is finished
    await getNewVecState(vehicleID)    

    // display comparison block hashes of replay local blockchain and notary data
    await compareHashes(blockID)
}



auditVechicleState()