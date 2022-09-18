const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: [true, 'email must be provided']
    },
    password:{
        type: String,
        required: [true, 'password must be provided']
    }
})

module.exports = mongoose.model('User', userSchema)