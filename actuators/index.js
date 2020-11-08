const WebSocket = require('ws');

// console.log(process.argv);
var myArgs = process.argv.slice(2);
// console.log('myArgs: ', myArgs);

const ws = new WebSocket('ws://localhost:8080', {
  perMessageDeflate: false
});

ws.on('open', function open() {
    console.log(`registered ${myArgs[1]} (in actuators)`)
    ws.send(myArgs[1]);
});
  
ws.on('message', function incoming(data) {
    console.log(`Recieved update in actuator: ${myArgs[1]}`);
    console.log(`${myArgs[0]} :${data}`);
});
  
// make sure the process does not terminate
setInterval(() => {}, 1 << 30);