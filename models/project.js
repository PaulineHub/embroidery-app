const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
    userId:{
        type: String
    },
    name:{
        type: String,
        required: [true, 'name must be provided']
    },
    threads:{
        type: Array
    },
    images:{
        type: Array
    }
})

module.exports = mongoose.model('Project', projectSchema)