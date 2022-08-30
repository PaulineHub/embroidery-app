const express = require('express');
const router = express.Router();

const {
    getAllItems,
    saveItem,
    deleteItem
} = require('../controllers/items');

router.route('/').get(getAllItems).post(saveItem).delete(deleteItem)


module.exports = router