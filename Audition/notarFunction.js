const http = require('http')
const { saveBlockHash } = require('./utils/saveBlockHash')


// calls function that writes block_id and timestamp to public blockchain every 6 seconds
setInterval(saveBlockHash, 6000)

function onRequest(request, response) { 
    response.writeHead(200, {'Conten-Tpye': 'text/plain'});
    response.write('Sending hashes to testnet');
    response.end()
}

http.createServer(onRequest).listen(8000)  // http://localhost:8000/
