//backend/models/newsTags.js
const supabase = require ('../config/supabase')

//Obtener los comentarios por ID de la noticia
exports.getCommentsByNewsId = async (noticia_id) => {
    const { data, error } = await supabase
        .from('comentarios')
        .select('*')
        .eq('noticia_id', noticia_id)
    if (error) throw error
    return data
}

//Crear un comentario nuevo
exports.createComment = async ({ noticia_id, usuario_id, contenido }) => {
    const { data, error } = await supabase
        .from('comentarios')
        .insert([{ noticia_id, usuario_id, contenido }])
    if (error) throw error
    return data
}