const WebSocket = require('ws');

console.log(process.argv);
var myArgs = process.argv.slice(2);
console.log('myArgs: ', myArgs);

const ws = new WebSocket('ws://localhost:8080', {
  perMessageDeflate: false
});

ws.on('open', function open() {
    console.log(`registered ${myArgs[1]}`)
    ws.send(myArgs[1]);
});
  
ws.on('message', function incoming(data) {
    console.log(data);
    console.log(myArgs[0]) // lock or lamp
});
  
// make sure the process does not terminate
setInterval(() => {}, 1 << 30);