const newsModel = require('../models/news')
const { v4: uuidv4 } = require('uuid')
const supabase = require('../config/supabase');

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
        console.log('\n=== INICIO DE CREACIÓN DE NOTICIA ===');
        
        if (!req.user) {
            return res.status(401).json({
                error: 'No autorizado - Usuario no encontrado'
            });
        }

        const { titulo, subtitulo, contenido } = req.body;
        let tags = [];
        
        try {
            tags = req.body.tags ? JSON.parse(req.body.tags) : [];
        } catch (e) {
            console.error('Error al parsear tags:', e);
            tags = [];
        }

        // Procesar imagen si existe
        let imagen_url = null;
        if (req.file) {
            imagen_url = await newsModel.uploadImage(req.file);
        }

        const noticiaData = {
            titulo,
            subtitulo,
            contenido,
            imagen_url,
            usuario_id: req.user.id,
            tags,
            estado: 'pendiente'
        };

        console.log('Datos a insertar:', noticiaData);

        const noticia = await newsModel.createNews(noticiaData);

        res.status(201).json({
            message: 'Noticia creada exitosamente',
            noticia
        });

    } catch (error) {
        console.error('Error al crear noticia:', error);
        res.status(500).json({
            error: 'Error al crear la noticia',
            message: error.message
        });
    }
}

//Actualizar una noticia por ID 
exports.updateNews = async (req, res) => {
    try {
        const { id } = req.params;
        const { titulo, subtitulo, contenido, etiqueta_id, estado } = req.body;
        
        // Verificar si el usuario tiene permisos para cambiar el estado
        if (estado === 'publicado' && !req.user.roles.includes('admin')) {
            return res.status(403).json({ 
                error: 'No tiene permisos para publicar noticias' 
            });
        }

        const updatedNews = await newsModel.updateNews(id, { 
            titulo, 
            subtitulo, 
            contenido, 
            etiqueta_id,
            estado 
        });
        
        res.status(200).json(updatedNews);
    } catch (error) {
        res.status(500).json({ error: 'Error al actualizar noticia' });
    }
}

// Actualizar el estado de una noticia
exports.updateNewsStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;
        
        const updatedNews = await newsModel.updateNews(id, { estado });
        
        res.status(200).json({
            message: 'Estado de la noticia actualizado correctamente',
            noticia: updatedNews
        });
    } catch (error) {
        console.error('Error al actualizar estado:', error);
        res.status(500).json({ 
            error: 'Error al actualizar el estado de la noticia' 
        });
    }
};

// Eliminar una noticia por ID

exports.deleteNews = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Iniciando eliminación de noticia:', id);

        // Verificar que la noticia existe antes de eliminar
        const { data: existingNews, error: checkError } = await supabase
            .from('noticias')
            .select('*')
            .eq('id', id)
            .single();

        console.log('Noticia encontrada:', existingNews);

        if (checkError || !existingNews) {
            return res.status(404).json({ 
                error: 'Noticia no encontrada' 
            });
        }

        // Eliminar etiquetas relacionadas primero
        const { error: tagError } = await supabase
            .from('noticias_etiquetas')
            .delete()
            .eq('noticia_id', id);

        if (tagError) {
            console.log('Error al eliminar etiquetas:', tagError);
            // Continuamos aunque falle la eliminación de etiquetas
        }

        // Eliminar la noticia
        const { error: deleteError } = await supabase
            .from('noticias')
            .delete()
            .eq('id', parseInt(id));

        if (deleteError) {
            console.error('Error al eliminar noticia:', deleteError);
            throw deleteError;
        }

        // Esperar un momento antes de verificar
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Verificar la eliminación
        const { data: checkDeleted, error: verifyError } = await supabase
            .from('noticias')
            .select('id')
            .eq('id', id)
            .single();

        if (verifyError) {
            console.log('Error al verificar eliminación:', verifyError);
        }

        // Si no encontramos la noticia, significa que se eliminó correctamente
        if (!checkDeleted) {
            console.log('Noticia eliminada exitosamente');
            return res.status(200).json({ 
                success: true,
                message: 'Noticia eliminada exitosamente',
                deletedId: id
            });
        } else {
            throw new Error('La noticia no fue eliminada correctamente');
        }

    } catch (error) {
        console.error('Error en deleteNews:', error);
        res.status(500).json({ 
            error: 'Error al eliminar la noticia',
            details: error.message 
        });
    }
};

// Obtener una noticia por ID
exports.getNewsById = async (req, res) => {
    try {
        const { id } = req.params;
        
        if (!id) {
            return res.status(400).json({ 
                error: 'ID de noticia no proporcionado' 
            });
        }

        const { data: noticia, error } = await supabase
            .from('noticias')
            .select(`
                *,
                usuarios (
                    id,
                    nombre,
                    apellido
                ),
                noticias_etiquetas (
                    etiqueta_id,
                    etiquetas (
                        id,
                        nombre
                    )
                )
            `)
            .eq('id', id)
            .single();

        if (error) throw error;

        if (!noticia) {
            return res.status(404).json({ 
                error: 'Noticia no encontrada' 
            });
        }

        res.status(200).json(noticia);
    } catch (error) {
        console.error('Error al obtener noticia:', error);
        res.status(500).json({ 
            error: 'Error al obtener la noticia',
            details: error.message 
        });
    }
};