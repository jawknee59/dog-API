/////////////////////////////////////
//// Import Dependencies         ////
/////////////////////////////////////
const { application } = require('express')
const express = require('express')
const morgan = require('morgan')
require('dotenv').config()

/////////////////////////////////////
//// Middleware                  ////
/////////////////////////////////////
app.use(morgan("tiny"))
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(express.json())


///////////////////////////////////////////
//// Export middleware function        ////
///////////////////////////////////////////
module.exports = middleware