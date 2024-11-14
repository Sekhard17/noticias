const tagsModel = require('../models/tags')

//Obtener todas las etiquetas
exports.getTags = async (req, res) => {
    try {
        const tags = await tagsModel.getTags()
        res.status(200).json(tags)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener etiquetas' })
    }
}

// Crear una nueva etiqueta
exports.createTag = async (req, res) => {
    try {
        const { nombre } = req.body
        const newTag = await tagsModel.createTag(nombre)
        res.status(201).json(newTag)
    } catch (error) {
        res.status(500).json({ error: 'Error al crear etiqueta' })
    }
}

//Editar una etiqueta
exports.editTag = async (req, res) => {
    try {
        const { id, nombre } = req.body
        const updatedTag = await tagsModel.updateTag(id, nombre)
        res.status(200).json(updatedTag)
    } catch (error) {
        res.status(500).json({ error: 'Error al editar etiqueta' })
    }
}