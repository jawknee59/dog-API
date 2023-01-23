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
const app = require('liquid-express-views')(express())

/////////////////////////////////////
//// Middleware                  ////
/////////////////////////////////////
middleware(app)

/////////////////////////////////////
//// Routes                      ////
/////////////////////////////////////
app.get('/', (req, res) => {
    // destructure our user info
    const { username, loggedIn, userId } = req.session
    res.render('home.liquid', { username, loggedIn, userId })
})

app.use('/dogs', DogRouter)
app.use('/comments', CommentRouter )
app.use('/users', UserRouter)

// this renders our error page
// gets the error from a url req query
app.get('/error', (req, res) => {
    const error = req.query.error || 'This page does not exist'
    // const { username, loggedIn, userId } = req.session
    // instead of destructuring this time, we show we can also
    // use the spread operator, which says "use all the parts of req.session" when you type ...req.session
    res.render('error.liquid', { error, ...req.session })
})

// this catchall route will redirect a user to the error page
app.all('*', (req, res) => {
    res.redirect('/error')
})

/////////////////////////////////////
//// Server Listener             ////
/////////////////////////////////////
const PORT = process.env.PORT
app.listen(PORT, () => console.log(`Port is listening on: ${PORT}`))

// END

