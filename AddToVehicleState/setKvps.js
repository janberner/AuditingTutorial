const { addkvp } = require('./addkvp')

/**
 * Function that calls script to execute smart contract to add key value pairs to local blockchain
 * @param source     the source/owner of the data
 * @param actor     the account how calls the smart contract, needs to be added to sourcemanag table of the constate contract 
 * @param vehicleId     name of the vehicle, has to be a eosio valid name. lowercase and 1-5, starting with a letter 
 * @param keyvalues  set the key-values to be added to the construction state of the given vehicle. Can be string or list 
 */

const actor = "fleet"
const source = "fleet"
const vehicleId= "auditvec1"
const keys = ["color","year"]
const values = ["red","2013"]



addkvp(actor, source ,vehicleId, keys, values )