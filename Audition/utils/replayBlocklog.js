var fs = require('fs');
const execSync = require('child_process').execSync;

 /**
   * function to replay available blocks.log on local machine
   */

function replayBlocklog() {
    console.log('\n------------------------\n')
    console.log('Delete file that impede replay, in /home/<user>/.local/share/eosio/nodeos/data')
    var cwd = process.cwd()
    var path = process.env.HOME;
    console.log('cwd output. ', cwd)
    process.chdir(path + '/.local/share/eosio/nodeos/data')

    // delete all files that are not needed for replay
    try {
        fs.unlinkSync('./blocks/blocks.index')
        console.log('deleted blocks.index')
    } catch (error) {
        console.log('File blocks.index not found')
    }

    try {
        fs.unlinkSync('./state/fork_db.dat')
        console.log('deleted /state/fork_db.dat')
    } catch (error) {
        console.log('File state/fork_db.dat not found')
    }

    try {
        fs.unlinkSync('./blocks/reversible/shared_memory.bin');
        console.log('deleted /reversible/shared_memory.bin')
    } catch (error) {
        console.log('File reversible/shared_memory.bin not found')
    }

    try {
        fs.unlink('./blocks/reversible/shared_memory.meta');
        console.log('deleted /reversible/shared_memory.meta')
    } catch (error) {
        console.log('File reversible/shared_memory.meta not found')
    }

    try {
        fs.rmdir('./state-histroy')
        console.log('deleted /state-history')
    } catch (error) {
        console.log('Directory state-histroy not found')
    }

    console.log('All files not needed for replay deleted!\n')

    process.chdir(cwd)
    try {
        console.log('Stopped nodeos.')
        execSync('pkill nodeos')
        sleep(2000)
    }
    catch (error) {
        console.log('Nodeos was not running')
    }
    
    process.chdir('../')
    console.log("\n------------------------\n")
    console.log("Start replay with trimmed blocks.log");

    // replay command 
    const foo = 'nodeos --replay-blockchain \
        --plugin eosio::producer_plugin      \
        --plugin eosio::chain_api_plugin \
        --plugin eosio::http_plugin          \
    >> nodeos.log 2>&1 &' ;

    execSync(foo)
    console.log('The replay is executed and the state of the blockchain is reconstructed');



}


function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}

module.exports = { replayBlocklog }