const execSync = require('child_process').execSync;

 /**
   * function that uses eosio-blocklog CLI to trimm blocks.log file
   */

async function trimBlockLog(block_num) { 
    console.log('\n------------------------\n')
    console.log('trim blocks.log file.')
    var cwd = process.cwd() 
    var path = process.env.HOME;
    process.chdir(path+'/.local/share/eosio/nodeos/data')

    console.log('cwd:', process.cwd())
    var foo = 'eosio-blocklog --blocks-dir=blocks --last='+ block_num + ' --trim-blocklog' ;
    execSync(foo)
    console.log('Blocks.log was trimmed to block number ' + block_num + '.');
    process.chdir(cwd)
}

module.exports = { trimBlockLog }

