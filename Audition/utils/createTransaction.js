
 /**
   * function to create transaction 
   */
function createTransaction(contractAccount, actionName, actor, data) {

    return { 
        actions: [{
            account: contractAccount,
            name: actionName,
            authorization: [{
                actor: actor,
                permission: 'active'
            }],
            data: data
        }]
    }
}

module.exports = { createTransaction }