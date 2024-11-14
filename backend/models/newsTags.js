//backend/models/newsTags.js
const supabase = require ('../config/supabase')

//Obtener etiquetas por ID de noticia
exports.getTagsByNews = async (noticia_id) => {
    const { data, error } = await supabase
        .from('noticias_etiquetas')
        .select('etiqueta_id')
        .eq('noticia_id', noticia_id)
    if (error) throw error
    return data
}

//Agregar etiquetas a una noticia
exports.addTagsToNews = async ({ noticia_id, etiqueta_id }) => {
    const { data, error } = await supabase
        .from('noticias_etiquetas')
        .insert([{ noticia_id, etiqueta_id }])
    if (error) throw error
    return data
}

