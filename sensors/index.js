const axios = require('axios')

var myArgs = process.argv.slice(2);
// console.log('myArgs: ', myArgs);

let obj = {
  sensorID: myArgs[1],
  sensorType: myArgs[0]
}
let count = 0;
const updateObj = () => {
  const sensorValue_base = myArgs[2];
  const sensorVariation = myArgs[3];
  const sensorValue_numeric = Math.random() * sensorVariation + parseFloat(sensorValue_base);
  const sensorValue = sensorValue_numeric >= 0.5 ? "motion" : "no motion";
  obj = {...obj, sensorValue};
  
  switch (myArgs[0]) {
    case 'motion':
        console.log(myArgs[0], 'Something is moving.');
        break;
    case 'noise':
        console.log(myArgs[0], `What's that sound?`);
        break;
    case 'proximity':
        console.log(myArgs[0], `It is near.`);
        break;
    case 'camera':
        console.log(myArgs[0], `How many cars?`);
        break;
    default:
        console.log('Sorry, the server name is invalid.');
  }
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
        },
        sensorID: myArgs[1]
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
    console.log(`sent ${count} images to the server`);
    updateObj();
    sendToServer();
}, 1000);

// make sure the process does not terminate
setInterval(() => {}, 1 << 30);

  

