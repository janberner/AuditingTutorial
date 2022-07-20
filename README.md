# Vehicle State auditing tutorial 

### Goal of the project

This tutorial will give you all the needed information and scripts so that you can setup a local blockchain. Deploy smarts contracts to the blockchain and interact with them.  At the end of this tutorial you will be able to populate your own vehicle state, on the blockchain. You will also have a mechanism (called notary credence) that makes the data on your local blockchain tamper evident using a public blockchain (Jungle Testnet). Thus you will be able to do your own simulated audition. 
Most of the code is designed to run on a single virtual machine, only the notary function uses a public blockchain to store information, via internet. Note the some of the shown setting are not meant to be used in a production environment. This project should be seen as a development project.
The next steps will guide you through all the neccessary installation and configuration. To learn more about the audition process and the idea behind it go to [Audition](#audition-of-the-vehicle-state).


### Requirements 

- Github Account
- Access to this [repo](https://github.com/janberner/AuditingTutorial) 
  - for now it is a private repo, to get access contcat jan.fabian.berner@gmail.com
- following guide is made for Ubuntu 20.04
  - recommend is a virtual machine (VM) with Linux installed
- install IDE of your choice, e.g. VS Code 

To setup a VM with virtual box and install Ubuntu you can find several step-by-step guides online, further information see [Ubuntu aufsetzen](#setup-virtual-machine-with-ubuntu).

Info: If you see a command with something like `<word>` you'll have to replace it with something you mostly defined or created before.  
  
  
## Basic Ubuntu installations

Execute following commands in a terminal. You can answer emerging questions during installations always with yes [Y].
These commands install all requiered tools for Linux.
```
sudo apt-get upgrade
```
```
sudo apt-get update
```
```
sudo apt install npm
```
```
sudo apt install curl 
```
```
sudo apt install git 

``` 

To run the scripts we need a recent nodejs version. A node version 10.xx is not sufficient. To install a working version use these commands 
```
curl -sL https://deb.nodesource.com/setup_16.x | sudo -E bash - 
sudo apt install nodejs -y

```
or see [here](https://github.com/nodesource/distributions/blob/master/README.md#debinstall) for the most recent versions. 


## Setup EOSIO 
The blockchain platfrom used for this project is EOSIO. To install EOSIO on your local VM type in

```
wget https://github.com/eosio/eos/releases/download/v2.1.0/eosio_2.1.0-1-ubuntu-20.04_amd64.deb
sudo apt install ./eosio_2.1.0-1-ubuntu-20.04_amd64.deb
```

Install EOSIO.cdt, a toolchain for WebAssembly (WASM) and set of tools to facilitate smart contract development for the EOSIO platform.

```
wget https://github.com/eosio/eosio.cdt/releases/download/v1.8.0/eosio.cdt_1.8.0-1-ubuntu-18.04_amd64.deb
sudo apt install ./eosio.cdt_1.8.0-1-ubuntu-18.04_amd64.deb
```
Now that EOSIO is installed on the VM a wallet can be created. For the simplicity of this tutorial some actions are used which are not recommended for production. Like the next command. It creates a wallet, which stores the keys to authorize actions on the blockchain, and prints the password for it to the console. The cryptographic system used by EOSIO is called public-key cryptography or asymmetric cryptography.
For more imformation about the next step and further options regarding *cleos* please see [developers.eosio/cleos](https://developers.eos.io/manuals/eos/latest/cleos/index).

```
cleos wallet create --to-console
```
Safe this password for later usage!
The default wallet can be unlocked using the just recieved password. Notice after some time of inactivity you will have to unlock the wallet again.
A wallet holds all your private keys which are used to sign transactions and to authorize yourself. 

```
cleos wallet unlock 
```
We now create a key pair of private and public key with
```
cleos create key --to-console
```
save both keys. (Command is not suitable for production).
Import private key to local wallet
```
cleos wallet import
```
enter private Key. Now that your wallet holds the private key you can use the public key to e.g. create accounts. 
You will need this private key later in the tutorial.
In the next step we import the EOSIO development key, note this key shouldn´t be used for production since it is publicly known. 
Type again
```
cleos wallet import 
```
and enter the following key 
```
5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3
```
The fundamentals are now set up and we can start a local blockchain by producing blocks.
Before we start actually the blockchain, we first start [keosd](https://developers.eos.io/manuals/eos/latest/keosd/index/?query=keosd&page=1#gatsby-focus-wrapper) (a dev. tool that manages keys) 

```
keosd & 
```
if an error occures most certainly keosd was already running. Just use 

```
pkill keosd 
keosd &
```
to stop it process and restart it again.

When starting a blockchain, we can add different plugins to the blockchain to enable specific features. More information about available plugins can be found [here](https://developers.eos.io/manuals/eos/latest/nodeos/plugins/index). With the settings below a blockchain with all basic and neccessary plugins is started and will begin to produce blocks. Note, in the directory the command is executed in, a file will be created *nodeos.log*, it logs the nodeos tool.

```
nodeos -e -p eosio \
--plugin eosio::producer_plugin \
--plugin eosio::producer_api_plugin \
--plugin eosio::chain_api_plugin \
--plugin eosio::http_plugin \
--plugin eosio::history_plugin \
--plugin eosio::history_api_plugin \
--filter-on="*" \
--access-control-allow-origin='*' \
--contracts-console \
--http-validate-host=false \
--verbose-http-errors >> nodeos.log 2>&1 &

```

You can use `tail -f nodeos.log` to see the most recent logs written to the file. Note, it does not contain any information regarding the content of the blockchain!
You can stop nodeos and thus also the block production with the command `pkill nodeos`, that should always be done before turning off the VM, thus the blockchain is shutdown properly. You can use the same command `pkill keosd` to stop keosd. For now you can keep it running. 
 
 
 ### Deploy Smart Contracts
 To clone this repo, change on the VM to a folder where the project should be stored 
  
```
git clone https://github.com/janberner/AuditingTutorial.git
```
Login with your Github credentials. 
Install the required node modules in the cloned folder with 

```
npm install node-fetch 
npm install node-fetch@2
npm install eosjs 
npm install fs
npm install fs-extra
```

Before we can deploy and use a smart contract we first have to create an account, accounts are also stored on the blockchain and identify individual users. A smart contract is deployed to an account, which can have a maximum of one smart contract. The account *vehiclestate* will hold the smart contract which will provide a source managment and handle the vehicle state data, from the created sources. Reminder you can unlock the wallet with `cleos wallet unlock`. 

```
cleos create account eosio vehiclestate <public_key>
```

Use the public key you recieved beforehand. (More info abount [Accounts and permissions](https://developers.eos.io/welcome/latest/protocol-guides/accounts_and_permissions/#31-permission-levels)).


To deploy a smart contract to an account the contract first needs to be build. To do so open the folder *SmartContracts* and run this command. (The warnings can be ignored). Note the command are designed to be executed in the *SmartContracts* folder. After you changed a smart contract code you always have to build it again. 

```
cd VehicleState/ && eosio-cpp -abigen -I ./include/ -o ./vehicleState.wasm ./src/VehicleState.cpp

```
Go back to *SmartContracts*.

Now we can deploy the smart contract to the blockchain 
```
cleos set contract vehiclestate VehicleState/ vehicleState.wasm vehicleState.abi -p vehiclestate@active
```
This deploys the smart contract, defined in the *.wasm* and *.abi* file, to the account *vehiclestate*. 
After the contract is successfully deployed we can call the defined actions. 
The first action we call is *addsource*, it adds a data source to the multi-index-table *sourcemanag*. Only data sources listed here will be able to add vehicle state data. 

 ```
 cleos push action vehiclestate addsource '["fleet"]' -p vehiclestate@active
 ```
 ```
 cleos get scope vehiclestate
 ```
 should return the following result
 ```
{
  "rows": [{
      "code": "vehiclestate",
      "scope": "vehiclestate",
      "table": "sourcemanag",
      "payer": "vehiclestate",
      "count": 1
    }
  ],
  "more": ""
}
```
You successfully added an entry to the multi-index-table. This entry and also the accounts and smart contract we just used are now written on the blockchain. 
 To retrieve the contents of the table use `cleos get table <account> <scope> <table>`. In our case
 ```
 cleos get table vehiclestate vehiclestate sourcemanag 
 ```
 which gives
 ```
{
  "rows": [{
      "source": "fleet"
    }
  ],
  "more": false,
  "next_key": "",
  "next_key_bytes": ""
}
 ```

The vehicle state information is depicted as key-value pairs (kvps). Each information has it´s own key with a value associated to it. To add these kvps to the smart contract a second account is created. Use the same public key as before. 

```
cleos create account eosio fleet <public_key>
```
The account is also called *fleet*, like the entry in the source managemnt talbe, and later uses the action *addvps* of the vehiclestate smart contract, to add kvps. The keys are defined in a path like notation, an example for a key cloud look like this `ecu/gateway/sw_version:`. 
For now we leave the local blockchain running and not add any kvps. 

The other smart contract used in this tutorial is called *notarCrednce*. Is simply takes a blockId and a timestamp as inputs and stores them in a table. This contract is deployed on a public blockchain, we see its usage in the next section. 
To build it execute, in *SmartContracts* folder,
```
cd NotaryCredence/ && eosio-cpp -abigen -I ./include/ -o ./notarCrednce.wasm ./src/NotaryCredence.cpp
```

### Jungle Testnet and notary function

For this tutorial the Jungle Testnet is used as public blockchain. It is one of the leading test environments for EOSIO based applications and has basically the same features as EOS mainnet with the advantage that it is free to use. In the next steps we create an account on the Jungle Testnet and deploy the *notarCrednce* smart contract. The first thing we have to do is creating a new key pair, we can do this with our local *cleos*, type in your terminal
```
cleos create key --to-console
```
save both keys. (Command is not suitable for production).
Import new key to local wallet

```
cleos wallet import
```
enter private Key.
Go to a recent Jungle Testnet site e.g. [here](https://monitor3.jungletestnet.io/#home)
Create an account with the generated public key.
Then click on *Faucet*, enter your account name to receive EOS token. (This can be redone every 6 hours)
Check if everything worked with *Account Info*. Your account should now have a blanace of 100.0000 EOS and 100.0000 JUNGLE.

Since we are now working on a public network our actions on the network requiere resources. On EOSIO based blockchains the system resources are

- *RAM* is the memory, the storage space, where the blockchain stores data. If your contract needs to store data on the blockchain, like in a database, then it can store it in the blockchain's RAM using a multi-index table.
- *NET* is measured by the byte size of the transactions saved in the blockchain database.
- *CPU* provides processing power to blockchain accounts. The amount of CPU an account has is measured in microseconds.

If you want to know more abount EOSIO rescources see [Link](https://developers.eos.io/manuals/eosio.contracts/latest/key-concepts/stake).
The next steps may lose their correctness as the value of an EOS token changes over time. If you get any error regarding the resources retry it or try to stake some more EOS to the respective resource. 

We can act on the Jungle Testnet blockchain in the same way as we do with our local blockchain. We just add *-u <endpoint>* at the beginning of commands. You can get a list of valid end points at the Jungle Testnet site. 
First let´s delegate some bandwith to our account. The account used here is called *auditjungle1*, please replace it with your account name. 
```
cleos -u http://jungle3.cryptolions.io:8888 system delegatebw auditjungle1 auditjungle1 "5 EOS" "15 EOS" -p auditjungle1@active

```
This stakes 5 EOS worth of net and 15 EOS worth of CPU to your account. If you get any error saying you do not have enought *NET* or *CPU*
 repeat the command a few times, this happens when the network is busy. 
 Now we should be able to create an account for our smart contract, its name has to be an EOSIO conform name (a-z,1-5 are allowed only. Length 12). You will need this name in the next steps.  
  
 ```
cleos -u http://jungle3.cryptolions.io:8888 system newaccount --stake-net "10.0000 EOS" --stake-cpu "40.0000 EOS" --buy-ram-kbytes 1000 auditjungle1 <account name> <public_key> <public_key>
```
  
To deploy the smart contract to the blockchain navigate to the directory *SmartContracts* and use the command
```
cleos -u http://jungle3.cryptolions.io:8888 set contract <account name> NotaryCredence/ notarCrednce.wasm notarCrednce.abi -p <account name>@active

```
  
You can view an accounts information by typing
```
cleos -u http://jungle3.cryptolions.io:8888 get account <account name>
```
  
If you want to see the content of the smart contract use
```
cleos -u http://jungle3.cryptolions.io:8888 get table <account name> <account name> notarcrednce
```
it´s the *account*, *scope* and *table*. See [link](https://developers.eos.io/manuals/eos/v2.2/cleos/command-reference/get/index) for more information about the *cleos get* method. 

You also have to make a few small changes in the code
- open the script *Audition/setTestnetAccount.js* and set the *const testnetAccount* to your account name.
- open the file *init.js* and add both private keys, you saved throughout this tutorial, and the private dev key `5KQwrPbwdL6PhXujxW37FSSQZ1JiwsST4cqQzDeyXtP79zkvFD3` to *defaultPrivateKey*. 
 

## Populate vehicle state 

Every time before you start to add vehicle state data (kvps) to the blockchain please run the script *Audition/notarFunction.js* with `node Audition/notarFunction.js`, make sure you are in the root folder of the project. Keep the app running and use a new terminal for further inputs. 
The app periodically writes the blockID and the timestamp to the smart contract you deployed in the previous step. Hence we are using the public Jungle testnet the rescources are limited, only keep the app running as long as necessary.  
While the app is running you can start populate the vehicle state with (pseudo) data. To do so open a new terminal, you can either use the cleos command directly in the terminal like so  
```
cleos push action vehiclestate addkvp '["fleet","auditvec1","{\"key1\":\"value1\"}"]' -p fleet@active
```
with this example the owner *fleet* adds the attribute *"color: red"* to the vehicle with the vehicleID *auditvec1*. Remark, also the vehicleID has to follow the [EOSIO name conventions](https://developers.eos.io/manuals/eosio.cdt/latest/best-practices/naming-conventions) 
Another way of adding information to a vehicle is by script. To do so open the script *addToVehicleState/setKvps.js* and fill in the data.  
An example could look like this
```
...
const actor = "fleet"
const owner = "fleet"
const vehicleId= "auditvec1"
const keys = ["key1","key2"]
const values = ["value1","value2"]
...
```
as you can see it is possible to multiple kvps at once.  
In this way, any vehicles can be created and filled with information. If a new value is transferred later for a key that has already been set, the old value in the table is overwritten. The information about it is not lost. If you look at the state of the blockchain at a time before the new value was added, you see the initial value in the vehicle state. When you are finished stop the *app* and also terminate nodeos with `pkill nodeos`.

## Audition of the vehicle state

In a potential real life scenario of a vehicle state audition we would export the blockchain log file *blocks.log*, from a blockchain hosted in a trusted (cloud) environment, further called source chain. This file contains all information about the blockchain in a nonhuman readable format, thus it cannot be easily compromised. In the course of auditing the auditor would name us a point of time at which he would like to review the vehicle state of one or more vehicles. We would then go to our *notarCredence* smart contract that is deployed to the EOS mainnet and search for the timestamp that is closest to the one the auditor want to see. Remark, the *notarCredence* smart contract stores blockIDs and their corresponding timestamps. Note, the EOS mainnet is a public blockchain with thousands of users and really strong security mechanisms, if you want to know more about them see [link](https://developers.eos.io/welcome/v2.1/protocol-guides/consensus_protocol#3-eosio-consensus-dpos--abft). By finding the best fitting timestamp we also get a blockID. This blockID belongs to a block in the source chain, that is during the audtion still operating. We then edit the *blocks.log* file, with a EOSIO built in utility, so only the information till the block that was determined by the given timestamp remains in the file. Now we can use this file to replay the blockchain on a local audition machine. After the replay is finished and the state of the source blockchain has been reconstructed the auditor can the vehicle state of all vehicles to this point in time and also check the active business logic, which is completely hosted on chain via the smart contracts. Furthermore we can give the auditor a notary attestaion of the blocks by comparing the local blocks with the once stored on the public blockchain. 


To keep things simple and easy to implement the auditon process for this tutorial has been changed. Our source blockchain is the one you just setup earlier and the vehicle state is also created by you. It's now on you to decide how many kvps you want to have in your vehiclestate before we start the audition. If you want to add some more data go back to [Populate vehicle state ](#populate-vehicle-state).
Once your are done filling the vehicle state and your testnet smart contract holds some notary data we can start the audition process.  
 To do this open the script *Audition/auditVechicleState.js* specify one of the self-defined *vehicleIDs* (default is auditvec1) and define a *timeOfInterest*, this should be in the processing period of the notary function (the *app.js* we started earlier). Only in this period block hashes were 'notary attested' on the public blockchain. Make sure you execute the script from the *Audition* folder with `node auditVechicleState.js`. During the audition, all relevant information is displayed in the terminal. Now the process runs like described in the section above with the difference that the source blockchain is our own local blockchain that we just populated. To ensure no data is lost a backup of the essential files is created, this also enables us to quickly reconstruct the source blockchain. You can find all the blockchain related files in the directory *~/.local/share/eosio/nodeos$*.  Remark, since we only have one blockchain that we can use for the vehicle state and the replay, the source blockchain is "deleted" for the sake of the audition but can be restored as just mentioned. Atfer the repaly is finished we have the same result as in the scenario above. 
Also, the Vehicle state before and after the replay are read, the respective json files can be found in the *Audition/data* folder. Along side with a file containing the data of the testnet smart contract. To double check the notary attestation you (or I a real audition the auditor) can open the file *Audition/data/notaryData.json* and use `cleos get block <block_id>` with any block_id from that file and compare the timestamps. This underlines the tamperevidence of the reconstructed blockchain and its included data.

To restore your origin source blockchain use `node restoreSourceChain.js`, also from the directory 

## Setup virtual machine with Ubuntu  

We use a Linux based OS to operate our local blockchain, therefor we use Virtual Box to setup a virtual machine. For this tutorial Ubuntu 20.04 was used. There are various step-by-step instructions on the internet on how to setup a Ubuntu VM via Virtual Box. 
Notes, use dynamic size hard drive, install *Guest Additions* and enable bidirectional Drag and Drop aswell as shared clipboard. 



## Troubleshooting

If you get a log message in the *nodeos.log* file that says "Database dirty flag set (likely due to unclean shutdown): replay required" use 
```
nodeos --replay-blockchain \
  --plugin eosio::producer_plugin \
  --plugin eosio::producer_api_plugin \
  --plugin eosio::chain_api_plugin  \
  --plugin eosio::http_plugin \
  >> nodeos.log 2>&1 &
```
to replay the chain. After the replay is done you can stop nodeos `pkill nodeos` and start it agian so it produces new blocks. More infos about the replay see this [Link](https://developers.eos.io/manuals/eos/latest/nodeos/replays/how-to-replay-from-a-blocks.log)
