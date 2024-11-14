const rolesModel = require('../models/roles')

exports.getRoles = async (req, res) => {
    try {
        const roles = await rolesModel.getRoles()
        res.status(200).json(roles)
    } catch (error) {
        console.error('Error:', error)
        res.status(500).json({ 
            error: 'Error al obtener roles',
            details: error.message 
        })
    }
} 