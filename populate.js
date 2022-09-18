require('dotenv').config()

const connectDB = require('./db/connect')
const Thread = require('./models/thread')

const jsonThreads = require('./data.json')

const start = async () =>{
    try {
        await connectDB(process.env.MONGO_URI)
        await Thread.deleteMany()
        await Thread.create(jsonThreads)
        console.log('Success !!!')
        process.exit(0)
    }catch(error){
        console.log(error)
        process.exit(1)
    }
}

start();