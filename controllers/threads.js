//ITEM MODEL
const Thread = require('../models/thread')

//REQUESTS

const getAllThreads = async(req,res)=>{
    const {category, code} = req.query
    const queryObject = {}
    if(category){
        queryObject.category = category
    }
    if(code){
        queryObject.code = code
    }
    const threads = await Thread.find(queryObject)
    res.status(200).json(threads)
    
}

const saveThread = async(req,res)=>{
    res.json(req.user)
}

const deleteThread = async(req,res)=>{
    
}

//EXPORT
module.exports = {
    getAllThreads,
    saveThread,
    deleteThread
}