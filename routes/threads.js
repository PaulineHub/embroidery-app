const express = require('express');
const router = express.Router();

const {
    getAllThreads
} = require('../controllers/threads');

router.route('/').get(getAllThreads);


module.exports = router