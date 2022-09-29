const Project = require('../models/project')
const { StatusCodes } = require('http-status-codes')
// const { BadRequestError, NotFoundError } = require('../errors')

const getAllProjects = async (req, res) => {
  const projects = await Project.find({ createdBy: req.user.userId }).sort('createdAt')
  res.status(StatusCodes.OK).json({ projects, count: projects.length })
}
const getProject = async (req, res) => {
  const {
    user: { userId },
    params: { id: projectId },
  } = req

  const project = await Project.findOne({
    _id: projectId,
    createdBy: userId,
  })
  if (!project) {
    throw new NotFoundError(`No project with id ${projectId}`)
  }
  res.status(StatusCodes.OK).json({ project })
}

const createProject = async (req, res) => {
  req.body.createdBy = req.user.userId
  console.log('req body ',req.body)
  const project = await Project.create(req.body)
  res.status(StatusCodes.CREATED).json({ project })
}

const updateProject = async (req, res) => {
  const {
    body: { name, status, description, threads, images },
    user: { userId },
    params: { id: projectId },
  } = req

  if (name === '' || status === '') {
    throw new BadRequestError('Company or Position fields cannot be empty')
  }
  const project = await Project.findByIdAndUpdate(
    { _id: projectId, createdBy: userId },
    req.body,
    { new: true, runValidators: true }
  )
  if (!project) {
    throw new NotFoundError(`No project with id ${projectId}`)
  }
  res.status(StatusCodes.OK).json({ project })
}

const deleteProject = async (req, res) => {
  // const {
  //   user: { userId },
  //   params: { id: projectId },
  // } = req

  // const project = await Project.findByIdAndRemove({
  //   _id: projectId,
  //   createdBy: userId,
  // })
  // if (!project) {
  //   throw new NotFoundError(`No project with id ${projectId}`)
  // }
  // res.status(StatusCodes.OK).send()
}

module.exports = {
  createProject,
  deleteProject,
  getAllProjects,
  updateProject,
  getProject,
}
