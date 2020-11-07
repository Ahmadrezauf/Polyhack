const WebSocket = require('ws');

const ws = new WebSocket('ws://localhost:8080', {
  perMessageDeflate: false
});

ws.on('open', function open() {
    ws.send('something from client');
});
  
ws.on('message', function incoming(data) {
    console.log(data);
});
  
// make sure the process does not terminate
setInterval(() => {}, 1 << 30);