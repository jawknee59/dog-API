/////////////////////////////////////////////////////////////
//// Our Schema and Model for the dog resource           ////
/////////////////////////////////////////////////////////////
const mongoose = require('../utils/connection')

// Destructure the Schema and model functions from mongoose
const { Schema } = mongoose

const commentSchema = new Schema({
    note: {
        type: String,
        required: true
    },
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
})

//////////////////////////////////
//// Export our Model         ////
//////////////////////////////////
module.exports = commentSchema