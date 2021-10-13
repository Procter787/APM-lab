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

// app.use('/style', express.static('./public/styles.css'))

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '/public/index.html'))
  rollbar.info('html file served successfully')
});

app.get('/', (req, res) => {
  res.send('hello, world')

  res.status(500).send({ message: 'Hello, world'})
})


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

let students = []

app.post('/api/student', (req,res) => {
    let { name } = req.body
    name = name.trim()

    const index = students.findIndex(studentName => studentName = name)

    if(index === -1 && name != ''){
        students.push(name)
        rollbar.log('Student added successfully', {author:'Dj',type:'manual entry'})
        res.status(200).send(students)
    } else if (name === ''){
        rollbar.critical('No name given')
        res.status(400).send('please provide a name.')
    } else {
        rollbar.warning('student already exists')
        res.status(400).send('this student already exists')
    }
})


// app.post
// if(){

// } else(){

// }

app.use(rollbar.errorHandler())



const port = process.env.PORT || 4400
  app.listen(port, () => console.log(`server is running on ${port}`))