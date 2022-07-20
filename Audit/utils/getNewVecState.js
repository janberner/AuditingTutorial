const { RpcError, localrpc } = require('../../init')
const fs = require('fs')

/**
   * function to get vehicle state table data after replay
   */


async function getNewVecState(vehicleID) {
    
  try {
    var response = await getTableData("vehiclestate", "vehiclestate", vehicleID)
    
    let hashdata = JSON.stringify(response, null, 2)
    fs.writeFileSync('./Audition/data/replayedVecState.json', hashdata)
    console.log('Vehicle state at the nearest valided block to the given timestamp saved in ', process.cwd()+'/data/replayedVehiclestate.json')
    return response
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




/**
  * function to get table data from a blockchain
  */
async function getTableData(contractAccount, tableName, scope) {
  try {
    const data = await localrpc.get_table_rows({
      json: true,
      code: contractAccount,
      scope: scope,
      table: tableName,
      limit: 1000,
      lower_bound: 0,
      reverse: false,
      show_payer: false,
    });
    return data.rows

  } catch (error) {
    console.error("err occured: ", error);
    console.log("rpc infos: ", localrpc.get_info());
  }
}




module.exports = { getNewVecState }


