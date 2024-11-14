const express = require('express')
const router = express.Router()
const validationController = require('../controllers/validationController')

router.get('/:noticia_id', validationController.getValidationStatus)
router.post('/', validationController.createValidationEntry)
router.put('/:id', validationController.updateValidationStatus)

module.exports = router