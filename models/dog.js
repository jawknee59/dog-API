/////////////////////////////////////////////////////////////
//// Our Schema and Model for the dog resource           ////
/////////////////////////////////////////////////////////////
const mongoose = require('../utils/connection')

// Destructure the Schema and model functions from mongoose
const { Schema, model } = mongoose

// Dog schema
const dogSchema = new Schema ({
    name: {
        type: String
    },
    breed:{ 
        type: String
    },
    gender:{ 
        type: String
    },
    dob:{ 
        type: Date
    },
    vaccinations:{ 
        type: Boolean
    },
    owner: {
        // this is where we set up an objectId reference
        // by declaring that as the type
        type: Schema.Types.ObjectId,
        // this line tells us which model to look at
        ref: 'User'
    }
}, { timestamps: true })

// make the dog model
// the model method takes two arg
// first - what we call our model
// second - the schema used to build our model
const Dog = model('Dog', dogSchema)

//////////////////////////////////
//// Export our Model         ////
//////////////////////////////////
module.exports = Dog



