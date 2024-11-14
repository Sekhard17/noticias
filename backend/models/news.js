//backend/models/news.js
const supabase = require('../config/supabase')
const path = require('path')
const fs = require('fs')

//Obtener todas las noticias

exports.getNews = async () => {
    console.log('Iniciando consulta de noticias...');
    
    const { data, error } = await supabase
        .from('noticias')
        .select(`
            id,
            titulo,
            subtitulo,
            contenido,
            imagen_url,
            estado,
            created_at,
            usuario_id,
            usuarios!noticias_usuario_id_fkey (
                id,
                nombre,
                apellido
            )
        `)
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error en la consulta:', error);
        throw error;
    }

    // Log para ver los datos crudos
    console.log('Datos crudos de la BD:', JSON.stringify(data, null, 2));

    // Transformación de datos más explícita
    const transformedData = data.map(noticia => {
        console.log('Usuario de la noticia:', noticia.usuarios);
        return {
            ...noticia,
            usuario: noticia.usuarios || null,
            usuarios: undefined
        };
    });

    console.log('Datos transformados:', JSON.stringify(transformedData, null, 2));
    return transformedData;
}

//Crear una noticia nueva
exports.createNews = async ({ titulo, subtitulo, contenido, imagen_url, usuario_id, tags = [] }) => {
    try {
        console.log('Creando noticia con datos:', {
            titulo,
            subtitulo,
            contenido,
            imagen_url,
            usuario_id,
            tags
        });

        // Agregar estado por defecto
        const estado = 'pendiente'; // o 'publicado' según tu lógica de negocio

        const { data: noticia, error } = await supabase
            .from('noticias')
            .insert([
                {
                    titulo,
                    subtitulo,
                    contenido,
                    imagen_url,
                    usuario_id,
                    estado, // Agregamos el estado
                    created_at: new Date().toISOString()
                }
            ])
            .select()
            .single();

        if (error) throw error;

        // Procesar tags si existen
        if (tags && tags.length > 0) {
            const { error: tagError } = await supabase
                .from('noticias_etiquetas')
                .insert(
                    tags.map(tag_id => ({
                        noticia_id: noticia.id,
                        etiqueta_id: parseInt(tag_id)
                    }))
                );

            if (tagError) throw tagError;
        }

        return noticia;
    } catch (error) {
        console.error('Error en createNews:', error);
        throw error;
    }
}

//Actualizar una noticia por su ID

exports.updateNews = async (id, { titulo, subtitulo, contenido, etiqueta_id, estado }) => {
    const updateData = {};
    
    // Solo incluir los campos que se proporcionan
    if (titulo) updateData.titulo = titulo;
    if (subtitulo) updateData.subtitulo = subtitulo;
    if (contenido) updateData.contenido = contenido;
    if (etiqueta_id) updateData.etiqueta_id = etiqueta_id;
    if (estado) updateData.estado = estado;

    const { data, error } = await supabase
        .from('noticias')
        .update(updateData)
        .eq('id', id)
        .select();

    if (error) throw error;
    return data;
}

//Eliminar una noticia por su ID
exports.deleteNews = async (id) => {
    try {
        console.log('Iniciando proceso de eliminación para ID:', id);

        // Primero eliminar las relaciones
        const { error: relError } = await supabase
            .from('noticias_etiquetas')
            .delete()
            .eq('noticia_id', id);

        if (relError) {
            console.error('Error al eliminar relaciones:', relError);
            throw relError;
        }

        // Luego eliminar la noticia
        const { error: deleteError } = await supabase
            .from('noticias')
            .delete()
            .match({ id: parseInt(id) });

        if (deleteError) {
            console.error('Error al eliminar noticia:', deleteError);
            throw deleteError;
        }

        // Verificar la eliminación
        const { data: checkDeleted } = await supabase
            .from('noticias')
            .select()
            .eq('id', id)
            .single();

        if (checkDeleted) {
            throw new Error('La noticia no fue eliminada correctamente');
        }

        return true;
    } catch (error) {
        console.error('Error en deleteNews:', error);
        throw error;
    }
}

// Función para subir imagen a Supabase Storage
exports.uploadImage = async (file) => {
    try {
        console.log('Iniciando subida de imagen:', {
            originalname: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
            path: file.path
        });

        // Generar nombre único para el archivo
        const fileExt = path.extname(file.originalname);
        const fileName = `${Date.now()}_${Math.random().toString(36).substring(7)}${fileExt}`;
        const filePath = `noticias/${fileName}`;

        // Leer el archivo
        const fileBuffer = await fs.promises.readFile(file.path);

        // Subir a Supabase Storage
        const { data, error } = await supabase
            .storage
            .from('cualquiera') // Nombre de tu bucket
            .upload(filePath, fileBuffer, {
                contentType: file.mimetype,
                cacheControl: '3600',
                upsert: false
            });

        if (error) {
            console.error('Error al subir imagen a Supabase:', error);
            throw error;
        }

        console.log('Imagen subida exitosamente:', data);

        // Obtener URL pública
        const { data: { publicUrl }, error: urlError } = supabase
            .storage
            .from('cualquiera')
            .getPublicUrl(filePath);

        if (urlError) {
            console.error('Error al obtener URL pública:', urlError);
            throw urlError;
        }

        // Limpiar archivo temporal
        await fs.promises.unlink(file.path).catch(err => {
            console.warn('Error al eliminar archivo temporal:', err);
        });

        console.log('URL pública generada:', publicUrl);
        return publicUrl;

    } catch (error) {
        console.error('Error en uploadImage:', error);
        throw error;
    }
}