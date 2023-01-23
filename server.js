/////////////////////////////////////
//// Import Dependencies         ////
/////////////////////////////////////
const express = require('express') // import the express framework
const morgan = require('morgan') // import the morgan request logger
require('dotenv').config() // Load my ENV file's variables
const path = require('path') // import path module
const DogRouter = require('./controllers/dogControllers')
const UserRouter = require('./controllers/userControllers')
const CommentRouter = require('./controllers/commentControllers')
const bp = require('body-parser')
const middleware = require('./utils/middleware')


/////////////////////////////////////
//// Create our Express App Object //
/////////////////////////////////////
// const app = express()
const app = express()

/////////////////////////////////////
//// Middleware                  ////
/////////////////////////////////////
middleware(app)

/////////////////////////////////////
//// Routes                      ////
/////////////////////////////////////
app.get('/', (req, res) => {
    res.send('Woof woof, server is live!')
})

app.use('/dogs', DogRouter)
app.use('/comments', CommentRouter )
app.use('/users', UserRouter)

/////////////////////////////////////
//// Server Listener             ////
/////////////////////////////////////
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Port is listening on: ${PORT}`))

// END

