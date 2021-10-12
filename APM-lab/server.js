const { application } = require('express')
const express = require('express')
// include and initialize the rollbar library with your access token
var Rollbar = require("rollbar");
var rollbar = new Rollbar({
  accessToken: 'f6756d18e2fa41ec8b9cdef8d4c27854',
  captureUncaught: true,
  captureUnhandledRejections: true
});

// record a generic message and send it to Rollbar
rollbar.log("Hello world!");

const app = express()

const path = require('path')

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'))
  rollbar.info('html file served successfully')
});

app.get('/errorTest', (req, res) => {
  try {
    nonExistentFunction();
  } catch (error) {
    console.error(error);
    rollbar.error(error);
    // expected output: ReferenceError: nonExistentFunction is not defined
    // Note - error messages will vary depending on browser
  }
  res.status(500).send({ message: 'succesfully failed' })
});



const port = process.env.PORT || 4400
  app.listen(port, () => console.log(`server is running on ${port}`))