const express = require('express')

const router = express.Router()
const {
  createProject,
  deleteProject,
  getAllProjects,
  updateProject,
  getProject,
} = require('../controllers/projects');

const { uploadProductImage } = require('../controllers/uploadsController');

router.route('/').post(createProject).get(getAllProjects)

router.route('/:id').get(getProject).delete(deleteProject).patch(updateProject)

router.route('/uploads').post(uploadProductImage);

module.exports = router
