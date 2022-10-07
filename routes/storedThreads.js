const express = require('express');
const router = express.Router();

const {
    getAllStoredThreads,
    createStoredThread,
    deleteStoredThread,
    updateStoredThread

} = require('../controllers/storedThreads');

router.route('/').get(getAllStoredThreads).post(createStoredThread);
router.route('/:id').delete(deleteStoredThread).patch(updateStoredThread);


module.exports = router