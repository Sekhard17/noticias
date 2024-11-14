//backend/controllers/authController.js

const usersModel = require('../models/users')

//Obtener todos los usuarios
exports.getUsers = async (req, res) => {
    try {
        const users = await usersModel.getUsers()
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener usuarios' })
    }   
}

//Registrar un nuevo usuario
exports.registerUser = async (req, res) => {
    try {
        const { nombre, apellido, email, contraseña, rol_id } = req.body
        const newUser = await usersModel.createUser({ nombre, apellido, email, contraseña, rol_id })
        res.status(201).json(newUser)
    } catch (error) {
        res.status(500).json({ error: 'Error al registrar usuario' })
    }
}