/////////////////////////////////////
//// Import Dependencies         ////
/////////////////////////////////////
const express = require('express')
const Dog = require('../models/dog')

/////////////////////////////////////
//// Create Router               ////
/////////////////////////////////////
const router = express.Router()

//////////////////////////////
//// Routes               ////
//////////////////////////////
// INDEX route
// Read -> finds and displays the dogs
router.get('/', (req, res) => {
    // find all of the dogs
    Dog.find({})
        // promise chain
        // send json if successful
        .then(dogs => {res.json({ dogs: dogs })})
        // catch errors if they occur
        .catch(err => {
            console.log(err)
            res.status(404).json(err)
        })
})

// CREATE route
// Create -> receives a request body, and creates a new document in the database
router.post('/', (req, res) => {
    // console.log('This is req.body: \n', req.body)
    req.body.owner = req.session.userId
    const newDog = req.body
    Dog.create(newDog)
    .then(dog => {
        res.status(201).json({ dog: dog.toObject() })
    })
    .catch(err => {
        console.log(err)
        res.status(404).json(err)
    })
})

// GET route
// Index -> This is a user specific index route
// this will only show the logged in user's dogs
router.get('/mine', (req, res) => {
    // find dogs by ownership, using the req.session info
    Dog.find({ owner: req.session.userId })
        .populate('owner', '-password')
        .then(dogs => {
            // if found, display the dogs
            res.status(200).json({ dogs: dogs })
        })
        .catch(err => {
            // otherwise throw an error
            console.log(err)
            res.status(400).json(err)
        })
})

// PUT route
// Update -> updates a specific dog(only if the dog's owner is updating)
router.put('/:id', (req, res) => {
    const id = req.params.id
    Dog.findById(id)
        .then(dog => {
            // if the owner of the dog is the person who is logged in
            if (dog.owner == req.session.userId) {
                // send success message
                res.sendStatus(204)
                // update and save the dog
                return dog.updateOne(req.body)
            } else {
                // otherwise send a 401 unauthorized status
                res.sendStatus(401)
            }
        })
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
        })
})

// DELETE route
// Delete -> delete a specific dog
router.delete('/:id', (req, res) => {
    const id = req.params.id
    Dog.findById(id)
        .then(dog => {
            // if the owner of the dog is the person who is logged in
            if (dog.owner == req.session.userId) {
                // send success message
                res.sendStatus(204)
                // delete the dog
                return dog.deleteOne()
            } else {
                // otherwise send a 401 unauthorized status
                res.sendStatus(401)
            }
        })
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
        })
})

// SHOW route
// Read -> finds and displays a single resource
router.get('/:id', (req, res) => {
    // get the id -> save to a variable
    const id = req.params.id
    // use a mongoose method to find using that id
    Dog.findById(id)
        // send the dog as json upon success
        .then(dog => {
            res.json({ dog: dog })
        })
        // catch any errors
        .catch(err => {
            console.log(err)
            res.status(404).json(err)
        })
})

//////////////////////////////
//// Export Router        ////
//////////////////////////////
module.exports = router