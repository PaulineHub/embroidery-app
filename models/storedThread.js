const mongoose = require('mongoose')

const storedThreadSchema = new mongoose.Schema({
    category:{
        type: String,
        values:['basket', 'box', 'project'],
        message:'{VALUE} is not supported'
    },
    storedBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    },
    threadCode:{
        type: String,
        required: [true, "thread's code must be provided"]
    },
    quantity: {
        type: Number,
        min: 1,
        required: [true, "quantity must be provided"]
    },
    projectId: {
        type: String
    }
})

module.exports = mongoose.model('StoredThread', storedThreadSchema)