const express = require('express')

const router = express.Router()
const {
  createProjectImage,
  deleteProjectImage,
  getAllProjectImages,
} = require('../controllers/projectImages');

const { uploadProjectImage } = require('../controllers/uploadProjectImage');

router.route('/').post(createProjectImage).get(getAllProjectImages)

router.route('/:id').delete(deleteProjectImage)

router.route('/uploads').post(uploadProjectImage);

module.exports = router
