const axios = require('axios')

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
  })
