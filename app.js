require('dotenv').config()
require('express-async-errors');

const express = require('express');
const app = express();

const connectDB = require('./db/connect');
const threadsRouter = require('./routes/threads')

//middleware errors
const notFoundMiddleware = require('./middleware/not-found');
const errorHandlerMiddleware = require('./middleware/error-handler');

//middleware
app.use(express.json())
app.use(express.static('./public'))

//routes

app.use('/api/v1/threads', threadsRouter)

//error routes
app.use(notFoundMiddleware)
app.use(errorHandlerMiddleware)

const port = 5000;

const start = async () => {
    try{
        await connectDB(process.env.MONGO_URI)
        app.listen(port,console.log(`Server is listening on port ${port}`))
    }catch(error){
        console.log(error)
    }
};

start();