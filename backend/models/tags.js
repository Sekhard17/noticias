//backend/models/tags.js
const supabase = require ('../config/supabase')

//Obtener todas las etiquetas
exports.getTags = async () => {
    const { data, error } = await supabase.from('etiquetas').select('*')
    if (error) throw error
    return data
}

//Crear una etiqueta nueva
exports.createTag = async ({ nombre }) => {
    const { data, error } = await supabase
        .from('etiquetas')
        .insert([{ nombre }])
    if (error) throw error
    return data
}