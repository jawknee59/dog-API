/////////////////////////////////////////////////////////////
//// Our Schema and Model for the fruit resource         ////
/////////////////////////////////////////////////////////////
const mongooose = require('mongoose')

// Destructure the Schema and model functions from mongoose
const { Schema, model } = mongooose

// Dog schema
const dogSchema = new Schema ({
    name: String,
    breed: String,
    gender: String,
    dob: Date,
    adopted: Boolean
}, {
    timestamps: true
})

// make the dog model
// the model method takes two arg
// first - what we call our model
// second - the schema used to build our model
const Dog = model('Dog', dogSchema)

//////////////////////////////////
//// Export our Model         ////
//////////////////////////////////
module.exports = Dog



