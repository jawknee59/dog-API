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

//////////////////////////////
//// Export Router        ////
//////////////////////////////
module.exports = router