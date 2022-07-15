const { localrpc } = require('../../init')

 /**
   * function to check if nodeos replay is finished
   */

async function nodeosRunning() {
  console.log("check if nodeos is up and running after replay:")

  var nodeosUp = false
  while (nodeosUp == false) {
    try {
      console.log("Info of reconstructed blockchain")
      var chainInfo = await (localrpc.get_info())
      console.log(chainInfo)
      console.log("Reconstruction finished, nodeos is running!")
      nodeosUp = true
    }
    catch (error) {
      //setTimeout(() => {console.error('catch error: \n', error);}, 5000) 
      await sleep(5000)
      console.log("Nodeos is not running. Wait 5 seconds and check again if replay is finished...\n")
    }
  }

}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}


module.exports = { nodeosRunning }



