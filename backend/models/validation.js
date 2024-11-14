//backend/models/validation.js
const supabase = require ('../config/supabase')

//Obtener estado de validación por ID de noticia
exports.getValidationStatus = async (noticia_id) => {
    const { data, error } = await supabase
        .from('noticias_validacion')
        .select('*')
        .eq('noticia_id', noticia_id)
    if (error) throw error
    return data
}

//Creamos una entrada de validación

exports.createValidationEntry = async ({ noticia_id, editor_id, estado }) => {
    const { data, error } = await supabase
        .from('noticias_validacion')
        .insert([{ noticia_id, editor_id, estado }])
    if (error) throw error
    return data
}

//Actualizamos el estado de validación por ID
exports.updateValidationStatus = async (id, estado) => {
    const { data, error } = await supabase
        .from('noticias_validacion')
        .update({ estado })
        .eq('id', id)
    if (error) throw error
    return data
}