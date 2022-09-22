const StoredThread = require('../models/storedThread');
const { StatusCodes } = require('http-status-codes')
// const { BadRequestError, NotFoundError } = require('../errors')

const getAllStoredThreads = async (req, res) => {
  console.log(req)
  const threads = await StoredThread.find({ storedBy: req.user.userId, category:req.query.category })
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

}

module.exports = {
  getAllStoredThreads,
  createStoredThread,
  deleteStoredThread,
  updateStoredThread,
  getStoredThread,
}
