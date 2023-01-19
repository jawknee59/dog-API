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
// This is my seed route
router.get('/seed', (req, res) => {
    // array of starter dogs
    const startDogs = [
        { 
            name: 'Leo', 
            breed: 'Husky', 
            gender: 'male',
            dob: new Date(2020, 7, 12), 
            vaccinations: true 
        },{ 
            name: 'Snowball', 
            breed: 'Shih Tzu', 
            gender: 'female',
            dob: new Date(2018, 11, 17), 
            vaccinations: true 
        },{ 
            name: 'Zeke', 
            breed: 'German Shepherd', 
            gender: 'male',
            dob: new Date(2019, 2, 4),
            loves: [], 
            vaccinations: false 
        }, {
            name: 'Bella', 
            breed: 'Border Collie', 
            gender: 'female',
            dob: new Date(2021, 5, 20), 
            vaccinations: false 
        }
    ]
    // delete every dog in the database
    Dog.deleteMany({})
        .then(() => {
            // then we'll seed(create) our starter dogs
            Dog.create(startDogs)
                .then(data => {
                    res.json(data)
                })
                .catch(err => console.log('The following error occurredd: \n', err))
        })
}) 

// INDEX route
// Read -> finds and displays the dogs
router.get('/', (req, res) => {
    // find all of the dogs
    Dog.find({})
        // promise chain
        // send json if successful
        .then(dogs => {res.json({ dogs: dogs })})
        // catch errors if they occur
        .catch(err => {console.log(err)})
})

// CREATE route
// Create -> receives a request body, and creates a new document in the database
router.post('/', (req, res) => {
    // console.log('This is req.body: \n', req.body)
    const newDog = req.body
    Dog.create(newDog)
    .then(dog => {
        res.status(201).json({ dog: dog.toObject() })
    })
    .catch(err => {console.log(err)})
})

// PUT route
// Update -> updates a specific fruit
// PUT replaces the entire document with a new document from the req.body
// PATCH is able to update specific fields at specific times, but it requires a little more code to ensure that it works properly, so we'll use that later
router.put('/:id', (req, res) => {
    // save the id to a variable for easy use later
    const id = req.params.id
    // save the request body to a variable for easy reference later
    const updatedDog = req.body
    // we're going to use the mongoose method:
    // findByIdAndUpdate
    // eventually we'll change how this route works, but for now, we'll do everything in one shot, with findByIdAndUpdate
    Dog.findByIdAndUpdate(id, updatedDog, { new: true })
        .then(dog => {
            console.log('the newly updated dog', dog)
            // update success message will just be a 204 - no content
            res.sendStatus(204)
        })
        .catch(err => console.log(err))
})

// DELETE route
// Delete -> delete a specific fruit
router.delete('/:id', (req, res) => {
    // get the id from the req
    const id = req.params.id
    // find and delete the fruit
    Dog.findByIdAndRemove(id)
        // send a 204 if successful
        .then(() => {
            res.sendStatus(204)
        })
        // send an error if not
        .catch(err => console.log(err))
})

// SHOW route
// Read -> finds and displays a single resource
router.get('/:id', (req, res) => {
    // get the id -> save to a variable
    const id = req.params.id
    // use a mongoose method to find using that id
    Dog.findById(id)
        // send the fruit as json upon success
        .then(dog => {
            res.json({ dog: dog })
        })
        // catch any errors
        .catch(err => console.log(err))
})

//////////////////////////////
//// Export Router        ////
//////////////////////////////
module.exports = router