const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'name must be provided']
    },
    // thread's codes
    threads:{
        type: Array,
        default:[]
    },
    // images path
    images:{
        type: Array,
        default:[]
    },
    storedBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
})

module.exports = mongoose.model('Project', projectSchema)