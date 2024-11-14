const express = require('express')
const router = express.Router()
const commentController = require('../controllers/commentController')

router.get('/:noticia_id', commentController.getCommentsByNewsId)
router.post('/', commentController.createComment)

module.exports = router