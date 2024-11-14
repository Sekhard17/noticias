// models/users.js
const supabase = require ('../config/supabase')

// Aquí vamos a crear el modelo de usuarios

//Obtener TODOS los usuarios:
exports.getUsers = async ( req, res ) => {
    const { data, error } = await supabase.from('usuarios').select('*')
    if (error) throw error
    return data
}

//Crear un nuevo usuario con contraseña
exports.createUser = async ({ nombre, apellido, email, contraseña, rol_id }) => {
    const { data, error } = await supabase
    .from('usuarios')
    .insert([{ nombre, apellido, email, contraseña, rol_id }])
    if (error) throw error
    return data
}

//Obtener un usuario por su email
exports.getUserByEmail = async (email) => {
    const { data, error } = await supabase.from('usuarios').select('*').eq('email').single()
    if (error) throw error
    return data
}
