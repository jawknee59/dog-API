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
// Read -> finds and displays all dogs
router.get('/', (req, res) => {
    const { username, loggedIn, userId } = req.session
    // find all the dogs
    Dog.find({})
        // there's a built in function that runs before the rest of the promise chain
        // this function is called populate, and it's able to retrieve info from other documents in other collections
        .populate('owner', 'username')
        .populate('comments.author', '-password')
        // send json if successful
        .then(dogs => { 
            // res.json({ dogs: dogs })
            // now that we have liquid installed, we're going to use render as a response for our controllers
            res.render('dogs/index', { dogs, username, loggedIn, userId })
        })
        // catch errors if they occur
        .catch(err => {
            console.log(err)
            // res.status(404).json(err)
            res.redirect(`/error?error=${err}`)
        })
})

// GET for the new page
// shows a form where a user can create a new dog
router.get('/new', (req, res) => {
    res.render('dogs/new', { ...req.session })
})

// CREATE route
// Create -> receives a request body, and creates a new document in the database
router.post('/', (req, res) => {
    // console.log('this is req.body before owner: \n', req.body)
    // here, we'll have something called a request body
    // inside this function, that will be called req.body
    // we want to pass our req.body to the create method
    // we want to add an owner field to our dog
    // luckily for us, we saved the user's id on the session object, so it's really easy for us to access that data
    req.body.owner = req.session.userId

    // we need to do a little js magic, to get our checkbox turned into a boolean
    // here we use a ternary operator to change the on value to send as true
    // otherwise, make that field false
    req.body.vaccinations = req.body.vaccinations === 'on' ? true : false
    const newDog = req.body
    // console.log('this is req.body aka newDog, after owner\n', newDog)
    Dog.create(newDog)
        // send a 201 status, along with the json response of the new dog
        .then(dog => {
            // in the API server version of our code we sent json and a success msg
            // res.status(201).json({ dog: dog.toObject() })
            // we could redirect to the 'mine' page
            // res.status(201).redirect('/dogs/mine')
            // we could also redirect to the new dog's show page
            res.redirect(`/dogs/${dog.id}`)
        })
        // send an error if one occurs
        .catch(err => {
            console.log(err)
            // res.status(404).json(err)
            res.redirect(`/error?error=${err}`)
        })
})

// GET route
// Index -> This is a user specific index route
// this will only show the logged in user's dogs
router.get('/mine', (req, res) => {
    // find dogs by ownership, using the req.session info
    Dog.find({ owner: req.session.userId })
        .populate('owner', 'username')
        .populate('comments.author', '-password')
        .then(dogs => {
            // if found, display the dogs
            // res.status(200).json({ dogs: dogs })
            res.render('dogs/index', { dogs, ...req.session })
        })
        .catch(err => {
            // otherwise throw an error
            console.log(err)
            // res.status(400).json(err)
            res.redirect(`/error?error=${err}`)
        })
})

// GET route for getting json for specific user dogs
// Index -> This is a user specific index route
// this will only show the logged in user's dogs
router.get('/json', (req, res) => {
    // find dogs by ownership, using the req.session info
    Dog.find({ owner: req.session.userId })
        .populate('owner', 'username')
        .populate('comments.author', '-password')
        .then(dogs => {
            // if found, display the dogs
            res.status(200).json({ dogs: dogs })
            // res.render('dogs/index', { dogs, ...req.session })
        })
        .catch(err => {
            // otherwise throw an error
            console.log(err)
            res.status(400).json(err)
        })
})

// GET request -> edit route
// shows the form for updating a dog
router.get('/edit/:id', (req, res) => {
    // because we're editing a specific dog, we want to be able to access the dog's initial values. so we can use that info on the page.
    const dogId = req.params.id
    Dog.findById(dogId)
        .then(dog => {
            res.render('dogs/edit', { dog, ...req.session })
        })
        .catch(err => {
            res.redirect(`/error?error=${err}`)
        })
})

// PUT route
// Update -> updates a specific dog(only if the dog's owner is updating)
router.put('/:id', (req, res) => {
    const id = req.params.id
    req.body.vaccinations = req.body.vaccinations === 'on' ? true : false
    Dog.findById(id)
        .then(dog => {
            // if the owner of the dog is the person who is logged in
            if (dog.owner == req.session.userId) {
                // send success message
                // res.sendStatus(204)
                // update and save the dog
                return dog.updateOne(req.body)
            } else {
                // otherwise send a 401 unauthorized status
                // res.sendStatus(401)
                res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20edit%20this%20dog`)
            }
        })
        .then(() => {
            // console.log('the dog?', dog)
            res.redirect(`/dogs/mine`)
        })
        .catch(err => {
            console.log(err)
            // res.status(400).json(err)
            res.redirect(`/error?error=${err}`)
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
                // res.sendStatus(204)
                // delete the dog
                return dog.deleteOne()
            } else {
                // otherwise send a 401 unauthorized status
                // res.sendStatus(401)
                res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20delete%20this%20dog`)
            }
        })
        .then(() => {
            res.redirect('/dogs/mine')
        })
        .catch(err => {
            console.log(err)
            // res.status(400).json(err)
            res.redirect(`/error?error=${err}`)
        })
})

// SHOW route
// Read -> finds and displays a single resource
router.get('/:id', (req, res) => {
    // get the id -> save to a variable
    const id = req.params.id
    // use a mongoose method to find using that id
    Dog.findById(id)
        .populate('comments.author', 'username')
        // send the dog as json upon success
        .then(dog => {
            // res.json({ dog: dog })
            res.render('dogs/show.liquid', {dog, ...req.session})
        })
        // catch any errors
        .catch(err => {
            console.log(err)
            // res.status(404).json(err)
            res.redirect(`/error?error=${err}`)
        })
})


//////////////////////////////
//// Export Router        ////
//////////////////////////////
module.exports = router