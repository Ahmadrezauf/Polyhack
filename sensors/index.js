const axios = require('axios')

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

