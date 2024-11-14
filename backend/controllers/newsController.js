const newsModel = require('../models/news')

//Obtener todas las noticias
exports.getNews = async (req, res) => {
    try {
        const news = await newsModel.getNews()
        res.status(200).json(news)
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener noticias' })
    }
}

//Crear una nueva noticia con etiquetas
exports.createNews = async (req, res) => {
    try {
        const { titulo, subtitulo, contenido, usuario_id, etiquetas } = req.body
        const newNews = await newsModel.createNews({ titulo, subtitulo, contenido, usuario_id, etiquetas })
        res.status(201).json(newNews)
    } catch (error) {
        res.status(500).json({ error: 'Error al crear noticia' })
    }
}

//Actualizar una noticia por ID 
exports.updateNews = async (req, res) => {
    try {
        const { id, titulo, subtitulo, contenido, etiqueta_id } = req.body
        const updatedNews = await newsModel.updateNews(id, { titulo, subtitulo, contenido, etiqueta_id })
        res.status(200).json(updatedNews)
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar noticia' })
    }
}

// Eliminar una noticia por ID

exports.deleteNews = async (req, res) => {
    try {
        const { id } = req.params
        await newsModel.deleteNews(id)
        res.status(200).json({ message: 'Noticia eliminada' })
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar noticia' })
    }
}