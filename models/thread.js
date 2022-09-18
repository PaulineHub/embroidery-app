const mongoose = require('mongoose')

const threadSchema = new mongoose.Schema({
    order:{
        type: String
    },
    category:{
        type: String,
        required: [true, 'category must be provided'],
        enum: ['red', 'orange', 'yellow', 'khaki', 'green', 'teal', 'blue', 'purple', 'pink', 'brown', 'light', 'dark']
    },
    code:{
        type: String,
        required: [true, 'code must be provided'],
        maxlength: [5, 'code can not be more than 5 characters']
    },
    image:{
        type: String
    }
})

module.exports = mongoose.model('Thread', threadSchema)