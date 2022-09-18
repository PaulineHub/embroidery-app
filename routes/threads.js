const express = require('express');
const router = express.Router();

const {
    getAllThreads,
    saveThread,
    deleteThread
} = require('../controllers/threads');

router.route('/').get(getAllThreads).post(saveThread).delete(deleteThread)


module.exports = router