//ITEM MODEL
const Item = require('../models/item')

//REQUESTS

const getAllItems = async(req,res)=>{
    const {category, code} = req.query
    const queryObject = {}
    if(category){
        queryObject.category = category
    }
    if(code){
        queryObject.code = code
    }
    const items = await Item.find(queryObject)
    res.status(200).json(items)
}

const saveItem = async(req,res)=>{

}

const deleteItem = async(req,res)=>{
    
}

//EXPORT
module.exports = {
    getAllItems,
    saveItem,
    deleteItem
}