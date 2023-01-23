/////////////////////////////////////
//// Import Dependencies         ////
/////////////////////////////////////
const mongoose = require('../utils/connection')
const Dog = require('./dog')

/////////////////////////////////////
//// Seed Script code            ////
/////////////////////////////////////
// first, we'll save our db connection to a variable
const db = mongoose.connection

db.on('open', () => {
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
    Dog.deleteMany({ owner: null })
        .then(() => {
            // then we'll seed(create) our starter dogs
            Dog.create(startDogs)
                .then(data => {
                    console.log('Here are the created dogs: \n', data)
                    db.close()
                })
                .catch(err => {
                    console.log('The following error occurred: \n', err)
                    db.close()
                })
        })
        .catch(err => {
            console.log(err)
            db.close()
        })        
}) 
