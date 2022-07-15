const { getHashes } = require('./getTestnetHashes')
const { getTimestamp } = require('./getTimestamp')


 /**
   * function to find nearest notraized block and return its blockID
   */

async function getNearestBlockID(timeOfInterest) { 
    console.log('Find nearest timestamp saved on notary blockchain.\n')

    // get notary data from public blockchain
    const notaryData = await getHashes();

    var smallestTimeDif = 1000000000;
    var block_id = 0
    for (let itr = 0; itr < notaryData.length; itr++){
        try {
        var timeDif = timeOfInterest - getTimestamp(notaryData[itr].timestamp) 
        }
        catch (error) {
            timeDif = 10000000000;
        }
        if ( Math.abs(timeDif) < smallestTimeDif ) {   // find nearest timestamp in total 
            // use to find next timestamp before given timestamp && timeDif >= 0  
            smallestTimeDif = timeDif
            block_id = notaryData[itr].block_id
        }
    }
    console.log("Smallest time diff to a validated block: ", smallestTimeDif/1000, 'sec\n')
    console.log("BlockID of the nearest validated block: \n", block_id)
    return block_id
    
}

module.exports = { getNearestBlockID }