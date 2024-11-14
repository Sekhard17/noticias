const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')

router.get('/users', authController.getUsers)
router.post('/login', authController.loginUser)
router.post('/register', authController.registerUser)
router.put('/users/:id', authController.updateUser)
router.delete('/users/:id', authController.deleteUser)
router.get('/users/:id', authController.getUserById)

module.exports = router