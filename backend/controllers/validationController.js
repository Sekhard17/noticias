const validationModel = require('../models/validation')

//Obtener estado de validación por ID de noticia
exports.getValidationStatus = async (req, res) => {
    try {
        const { noticia_id } = req.params
        const validationStatus = await validationModel.getValidationStatus(noticia_id)
        res.status(200).json(validationStatus)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener estado de validación' })
    }
}

//Crear una entrada de validación
exports.createValidationEntry = async (req, res) => {
    try {
        const { noticia_id, editor_id, estado } = req.body
        const newValidationEntry = await validationModel.createValidationEntry({ noticia_id, editor_id, estado })
        res.status(201).json(newValidationEntry)
    } catch (error) {
        res.status(500).json({ error: 'Error al crear entrada de validación' })
    }
}

//Actualizar el estado de validación por ID
exports.updateValidationStatus = async (req, res) => {
    try {
        const { id, estado } = req.body
        const updatedValidationStatus = await validationModel.updateValidationStatus(id, estado)
        res.status(200).json(updatedValidationStatus)
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar estado de validación' })
    }
}