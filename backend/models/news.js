//backend/models/news.js
const supabase = require ('../config/supabase')

//Obtener todas las noticias

exports.getNews = async () => {
    const { data, error } = await supabase.from('noticias').select('*')
    if (error) throw error
    return data
}

//Crear una noticia nueva
exports.createNews = async ({ titulo, subtitulo, contenido, usuario_id, etiquetas }) => {
    const { data, error } = await supabase
        .from('noticias')
        .insert([{ titulo, subtitulo, contenido, usuario_id, etiquetas }])
        .select()
        .single()

        if (noticiaError) throw noticiaError

        //Si se entrega una lista de etiquetas, se debe agregarlas a la noticia
        if (etiquetas && etiquetas.length > 0) {
            const etiquetasData = etiquetas.map(etiqueta_id => ({
                noticia_id: noticiaData.noticia_id,
                etiqueta_id
            }))

            const { error: etiquetasError } = await supabase
                .from('noticias_etiquetas')
                .insert(etiquetasData)

            if (etiquetasError) throw etiquetasError
        }

    return noticiaData
}

//Actualizar una noticia por su ID

exports.updateNews = async (id, { titulo, subtitulo, contenido, etiqueta_id }) => {
    const { data, error } = await supabase
        .from('noticias')
        .update({ titulo, subtitulo, contenido, etiqueta_id })
        .eq('id', id)
    if (error) throw error
    return data
}

//Eliminar una noticia por su ID
exports.deleteNews = async (id) => {
    const { data, error } = await supabase
        .from('noticias')
        .delete()
        .eq('id', id)
    if (error) throw error
    return data
}