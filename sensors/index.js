const axios = require('axios')

var myArgs = process.argv.slice(2);
console.log('myArgs: ', myArgs);

let obj = {}
let count = 0;
switch (myArgs[0]) {
  case 'motion':
      console.log(myArgs[1], 'Something is moving.');
      break;
  case 'noise':
      console.log(myArgs[1], `What's that sound?`);
      break;
  case 'proximity':
      console.log(myArgs[1], `It is near.`);
      break;
  case 'camera':
      console.log(myArgs[1], `How many cars?`);
      break;
  default:
      console.log('Sorry, the server name is invalid.');
}

const sendToServer = () => {
  if(myArgs[0] == 'camera'){
    const FormData = require('form-data');
    const formData = new FormData();
    const imagefile = require('fs').createReadStream(`./frames/${count}.png`); //readFileSync(`./frames/${count}.png`);
    formData.append("image", imagefile);
    axios.post('http://localhost:3000/send_image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
    })
  }
  else{
    axios
    .post('http://localhost:3000/api', obj)
    .then(res => {
      //console.log(`statusCode: ${res.statusCode}`)
      //console.log(res.data)
    })
    .catch(error => {
      console.error(error)
    });
  }
  
}

setInterval(()=>{
    count += 1;
    count %= 229;
    console.log(`sent ${count} messages`);
    sendToServer();
}, 1000);

// make sure the process does not terminate
setInterval(() => {}, 1 << 30);

  

