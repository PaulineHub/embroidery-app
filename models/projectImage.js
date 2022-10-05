const mongoose = require('mongoose')

const projectImageSchema = new mongoose.Schema({
    src:{
        type: String,
        required: [true, 'src of the image must be provided']
    },
    projectId:{
        type: String,
        required: [true, 'id of the project must be provided']
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'Please provide user'],
    }
})

module.exports = mongoose.model('ProjectImage', projectImageSchema)