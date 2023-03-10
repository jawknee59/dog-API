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
// only need two routes for comments right now
// POST -> `/comments/><someDogId>
// to create a comment
router.post('/:dogId', (req, res) => {
    // first get the dogId and save to a variable
    const dogId = req.params.dogId
    console.log('first comment body', req.body)
    
    if(req.session.loggedIn) {

        req.body.author = req.session.userId
        const theComment = req.body
        // console.log('Updated comment body', theComment)
        Dog.findById(dogId)
            .then(dog => {
                dog.comments.push(theComment)
                return dog.save()
            })
            .then(dog => {
                // res.status(201).json({ dog: dog })
                res.redirect(`/dogs/${dog.id}`)
            })
            .catch(err => {
                console.log(err)
                // res.status.json(err)
                res.redirect(`/error?error=${err}`)
            })
    } else {
        // res.sendStatus(401) 
        res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20comment%20on%20this%20dog`)
    }
})

// DELETE -> `/comments/delete/<someDogId>/<someCommentId>`
// make sure only the author of the comment can delete the comment
router.delete('/delete/:dogId/:commId', (req, res) => {
    const { dogId, commId } = req.params

    Dog.findById(dogId)
        .then(dog => {
            // get the comment, we'll use the built in subdoc method called .id()
            const theComment = dog.comments.id(commId)
            console.log('this is the comment to be deleted: \n', theComment)
            // then we want to make sure the user is loggedIn, and that they are the author of the comment
            if (req.session.loggedIn) {
                // if they are the author, allow them to delete
                if (theComment.author == req.session.userId) {
                    // we can use another built in method - remove()
                    theComment.remove()
                    dog.save()
                    // res.sendStatus(204) //send 204 no content
                    res.redirect(`/dogs/${dog.id}`)
                } else {
                    // otherwise send a 401 - unauthorized status
                    // res.sendStatus(401)
                    res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20delete%20this%20comment`)
                }
            } else {
                // otherwise send a 401 - unauthorized status
                // res.sendStatus(401)
                res.redirect(`/error?error=You%20Are%20not%20allowed%20to%20delete%20this%20comment`)
            }
        })
        .catch(err => {
            console.log(err)
            res.status(400).json(err)
            res.redirect(`/error?error=${err}`)
        })
})

//////////////////////////////
//// Export Router        ////
//////////////////////////////
module.exports = router