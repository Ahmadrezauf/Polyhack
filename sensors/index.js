const axios = require('axios')

var myArgs = process.argv.slice(2);
console.log('myArgs: ', myArgs);

const sendToServer = () => {
  axios
    .post('http://localhost:3000/api', {
      todo: 'Buy the milk'
    })
    .then(res => {
      console.log(`statusCode: ${res.statusCode}`)
      console.log(res.data)
    })
    .catch(error => {
      console.error(error)
    });
}

let count = 0;
setInterval(()=>{
    count += 1;
    console.log(`sent ${count} messages`);
    sendToServer();
}, 2000);

// make sure the process does not terminate
setInterval(() => {}, 1 << 30);

switch (myArgs[0]) {
  case 'motion':
      console.log(myArgs[1], 'Something is moving.');
      break;
  case 'noise':
      console.log(myArgs[1], `What's that sound?`);
      break;
  default:
      console.log('Sorry, the server name is invalid.');
}
  

