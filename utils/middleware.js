/////////////////////////////////////
//// Import Dependencies         ////
/////////////////////////////////////
const express = require('express') // import the express framework
const morgan = require('morgan') // import the morgan request logger
const session = require('express-session') // import the express-session package
const MongoStore = require('connect-mongo') // import the connect-mongo package(for sessions)
require('dotenv').config()
const bp = require('body-parser')

/////////////////////////////////////
//// Middleware                  ////
/////////////////////////////////////
const middleware = (app) => {
    app.use(morgan('tiny'))
    app.use(express.urlencoded({ extended: true }))
    app.use(express.static('public'))
    app.use(express.json())
    app.use(bp.json())
    app.use(bp.urlencoded({extended: true}))

    app.use(
        session({
            secret: process.env.SECRET,
            store: MongoStore.create({
                mongoUrl: process.env.DATABASE_URL
            }),
            saveUninitialized: true,
            resave: false
        })
    )
}


///////////////////////////////////////////
//// Export middleware function        ////
///////////////////////////////////////////
module.exports = middleware