const ProjectImage = require('../models/projectImage')
const { StatusCodes } = require('http-status-codes')
// const { BadRequestError, NotFoundError } = require('../errors')

const getAllProjectImages = async (req, res) => {
  const params = {
    ...req.query,
    createdBy: req.user.userId
  };
  const images = await ProjectImage.find(params).sort('createdAt')
  res.status(StatusCodes.OK).json({ images, count: images.length })
}

const createProjectImage = async (req, res) => {
  req.body.createdBy = req.user.userId
  const image = await ProjectImage.create(req.body)
  res.status(StatusCodes.CREATED).json({ image })
}

const deleteProjectImage = async (req, res) => {
  const {
    user: { userId },
    params: { id: imageId },
  } = req

  const image = await ProjectImage.findByIdAndRemove({
    _id: imageId,
    createdBy: userId,
  })
  if (!image) {
    throw new NotFoundError(`No project with id ${imageId}`)
  }
  res.status(StatusCodes.OK).send()
}

module.exports = {
  createProjectImage,
  deleteProjectImage,
  getAllProjectImages
}
