const fs = require('fs-extra');
const { replayBlocklog } = require('./utils/replayBlocklog')
const { nodeosRunning } = require('./utils/nodeosRunning')

/* 
Function restores the blockchain state before the audition replay. 
Only works if a backup is available. When running the audition a backup is automatically created
*/ 
async function restoreScourceChain() {

    
    var path = process.env.HOME;
    console.log('Copy backups back in /home/<user>/.local/share/eosio/nodeos/data')
    const srcDir = path +'/.local/share/eosio/nodeos/databackup';
    const destDir = path + '/.local/share/eosio/nodeos/data';
                                  
    // To copy a folder or file  
    fs.copySync(srcDir, destDir)

    // replays the blockchain with the available blocks.log file
    replayBlocklog()

    // checks if nodeos is running to determine if replay is finished
    await nodeosRunning()

    console.log('Source blockchain backup restored!')
}


restoreScourceChain()