const { RpcError, junglerpc} = require('../../init')
const fs = require ('fs')
const {getTestnetAccount} = require('../setTestnetAccount')

 /**
   * function to get notary data from public blockchain and saves it as json file
   */

async function getHashes() { 
    testnetAccount = getTestnetAccount()
    try {
        const response  = await getTableData(testnetAccount, "notarcrednce", testnetAccount)  //  notarcrednce
        let hashdata = JSON.stringify(response, null, 2)
        fs.writeFileSync('./data/notaryData.json', hashdata)
        return response
    }
    catch (error){
        if (error instanceof RpcError) { 
            console.log(`EOSIO Rpc Error occured:\n${JSON.stringify(error.json, null, 2)}`);
            return { response: null , error: error.json }
        }
        else { 
            console.log(`Error occured: ` + error);
            return { response: null , error: error }
        }
    }
}


 /**
   * function to get table data from a blockchain
   */
  async function getTableData(contractAccount,tableName, scope ) {
    try {
      const data = await junglerpc.get_table_rows({
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
      console.log("rpc infos: ", junglerpc.get_info());
    }
  }
  

module.exports = { getHashes }