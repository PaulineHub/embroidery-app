const mongoose = require('mongoose')

const storedThreadSchema = new mongoose.Schema({
    category:{
        type: String,
        values:['basket', 'box'],
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
    }
})

module.exports = mongoose.model('StoredThread', storedThreadSchema)