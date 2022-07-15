const fs = require('fs-extra');

 /**
   * function to backup local blockchain data for later reconstruction
   */

async function backupChainData() {
    console.log('Backup blockchain data for later recovery of the source blockchain.')
    var path = process.env.HOME;
    const srcDir = path +'/.local/share/eosio/nodeos/data'; 
    const destDir = path + '/.local/share/eosio/nodeos/databackup';
    
    
    if (fs.existsSync(destDir)){
        console.log('Backup already exists. No new backup has been created')
    } else 
    {
    // To copy a folder or file  
    fs.copySync(srcDir, destDir)
    }
   
}

module.exports = { backupChainData }