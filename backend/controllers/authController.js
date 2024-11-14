//backend/controllers/authController.js

const usersModel = require('../models/users')
const jwt = require('jsonwebtoken')

//Obtener todos los usuarios
exports.getUsers = async (req, res) => {
    try {
        console.log('Obteniendo usuarios...')
        const users = await usersModel.getUsers()
        console.log('Usuarios obtenidos:', users)
        res.status(200).json(users)
    } catch (error) {
        console.error('Error detallado:', error)
        res.status(500).json({ 
            error: 'Error al obtener usuarios', 
            details: error.message 
        })
    }   
}

//Registrar un nuevo usuario
exports.registerUser = async (req, res) => {
    try {
        console.log('Datos recibidos:', req.body)
        const { nombre, apellido, email, contraseña, rol_id } = req.body
        
        // Verificar si el usuario ya existe
        const existingUser = await usersModel.getUserByEmail(email)
        if (existingUser) {
            return res.status(400).json({ 
                error: 'El correo electrónico ya está registrado' 
            })
        }

        const newUser = await usersModel.createUser({ 
            nombre, 
            apellido, 
            email, 
            contraseña, 
            rol_id 
        })

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            user: newUser
        })
    } catch (error) {
        console.error('Error en registro:', error)
        res.status(500).json({ 
            error: 'Error al registrar usuario',
            message: error.message 
        })
    }
}

exports.loginUser = async (req, res) => {
    try {
        const { email, contraseña } = req.body
        
        // Verificar si el usuario existe
        const user = await usersModel.getUserByEmail(email)
        if (!user) {
            return res.status(401).json({ 
                error: 'Credenciales inválidas' 
            })
        }

        // Verificar contraseña
        if (user.contraseña !== contraseña) { // Idealmente deberías usar bcrypt aquí
            return res.status(401).json({ 
                error: 'Credenciales inválidas' 
            })
        }

        // Crear token JWT
        const token = jwt.sign(
            { 
                id: user.id, 
                email: user.email,
                rol_id: user.rol_id 
            },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        )

        // Eliminar la contraseña del objeto usuario
        delete user.contraseña

        res.status(200).json({
            message: 'Login exitoso',
            token,
            user
        })
    } catch (error) {
        console.error('Error en login:', error)
        res.status(500).json({ 
            error: 'Error al iniciar sesión',
            message: error.message 
        })
    }
}

// Actualizar usuario
exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params
        const userData = req.body

        // Verificar si el email ya existe (si se está cambiando)
        if (userData.email) {
            const existingUser = await usersModel.getUserByEmail(userData.email)
            if (existingUser && existingUser.id !== parseInt(id)) {
                return res.status(400).json({
                    error: 'El correo electrónico ya está registrado'
                })
            }
        }

        const updatedUser = await usersModel.updateUser(id, userData)
        res.status(200).json({
            message: 'Usuario actualizado exitosamente',
            user: updatedUser
        })
    } catch (error) {
        console.error('Error en actualización:', error)
        res.status(500).json({
            error: 'Error al actualizar usuario',
            message: error.message
        })
    }
}

// Eliminar usuario
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params
        await usersModel.deleteUser(id)
        res.status(200).json({
            message: 'Usuario eliminado exitosamente'
        })
    } catch (error) {
        console.error('Error en eliminación:', error)
        res.status(500).json({
            error: 'Error al eliminar usuario',
            message: error.message
        })
    }
}

// Agregar este método
exports.getUserById = async (req, res) => {
    try {
        const { id } = req.params
        const user = await usersModel.getUserById(id)
        
        if (!user) {
            return res.status(404).json({
                error: 'Usuario no encontrado'
            })
        }

        res.status(200).json(user)
    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({
            error: 'Error al obtener usuario',
            details: error.message
        })
    }
}