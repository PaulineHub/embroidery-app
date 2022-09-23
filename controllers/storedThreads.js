const StoredThread = require('../models/storedThread');
const { StatusCodes } = require('http-status-codes')
 const { BadRequestError, NotFoundError } = require('../errors')

const getAllStoredThreads = async (req, res) => {
  const threads = await StoredThread.find({ storedBy: req.user.userId, category:req.query.category })
  console.log(threads)
  res.status(StatusCodes.OK).json({ threads, count: threads.length })
}

const createStoredThread = async (req, res) => {
  req.body.storedBy = req.user.userId;
  const storedThread = await StoredThread.create(req.body)
  res.status(StatusCodes.CREATED).json({ storedThread })
}

const getStoredThread = async (req, res) => {

}

const updateStoredThread = async (req, res) => {

}

const deleteStoredThread = async (req, res) => {
  const {
    user: { userId },
    params: { id: threadId },
  } = req


  const storedThread = await StoredThread.findByIdAndRemove({
    _id: threadId,
    storedBy: userId,
  })
  if (!storedThread) {
    throw new NotFoundError(`No thread with code ${threadId}`);
  }
  res.status(StatusCodes.OK).send();
}

module.exports = {
  getAllStoredThreads,
  createStoredThread,
  deleteStoredThread,
  updateStoredThread,
  getStoredThread,
}
