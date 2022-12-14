const mongoose = require('mongoose')

const projectSchema = new mongoose.Schema({
    name:{
        type: String,
        required: [true, 'name must be provided']
    },
    description:{
        type: String,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
    status: {
        type: String,
        required: [true, 'status must be provided'],
        enum: ['not started', 'in progress', 'on pause', 'over']
    }
})

module.exports = mongoose.model('Project', projectSchema)