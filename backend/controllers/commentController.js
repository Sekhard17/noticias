const commentsModel = require('../models/comments')

//Obtener comentarios por ID de noticia

exports.getCommentsByNewsId = async (req, res) => {
    try {
        const { noticia_id } = req.params
        const comments = await commentsModel.getCommentsByNewsId(noticia_id)
        res.status(200).json(comments)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener comentarios' })
    }
}

//Crear un comentario nuevo
exports.createComment = async (req, res) => {
    try {
        const { noticia_id, usuario_id, contenido } = req.body
        const newComment = await commentsModel.createComment({ noticia_id, usuario_id, contenido })
        res.status(201).json(newComment)
    } catch (error) {
        res.status(500).json({ error: 'Error al crear comentario' })
    }
}