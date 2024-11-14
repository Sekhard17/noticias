// models/users.js
const supabase = require('../config/supabase')

// Aquí vamos a crear el modelo de usuarios

//Obtener TODOS los usuarios:
exports.getUsers = async () => {
    try {
        const { data, error } = await supabase
            .from('usuarios')
            .select(`
                *,
                roles:rol_id (
                    nombre
                )
            `)
            .order('created_at', { ascending: false })

        if (error) {
            console.error('Error de Supabase:', error)
            throw error
        }
        
        console.log('Datos obtenidos:', data) // Para debug
        return data
    } catch (error) {
        console.error('Error en getUsers:', error)
        throw error
    }
}

//Crear un nuevo usuario con contraseña
exports.createUser = async ({ nombre, apellido, email, contraseña, rol_id }) => {
    try {
        const { data, error } = await supabase
            .from('usuarios')
            .insert([{ 
                nombre, 
                apellido, 
                email, 
                contraseña, 
                rol_id 
            }])
            .select()
            .single()

        if (error) throw error
        return data
    } catch (error) {
        console.error('Error en createUser:', error)
        throw error
    }
}

//Obtener un usuario por su email
exports.getUserByEmail = async (email) => {
    try {
        const { data, error } = await supabase
            .from('usuarios')
            .select('*')
            .eq('email', email)
            .single()
            
        if (error && error.code !== 'PGRST116') { // Ignorar error cuando no se encuentra el usuario
            throw error
        }
        return data
    } catch (error) {
        console.error('Error en getUserByEmail:', error)
        throw error
    }
}

// Obtener usuario por ID
exports.getUserById = async (id) => {
    try {
        const { data, error } = await supabase
            .from('usuarios')
            .select(`
                *,
                roles:rol_id (
                    nombre
                )
            `)
            .eq('id', id)
            .single()

        if (error) throw error
        return data
    } catch (error) {
        console.error('Error en getUserById:', error)
        throw error
    }
}

// Actualizar usuario
exports.updateUser = async (id, userData) => {
    try {
        const { data, error } = await supabase
            .from('usuarios')
            .update(userData)
            .eq('id', id)
            .select()
            .single()

        if (error) throw error
        return data
    } catch (error) {
        console.error('Error en updateUser:', error)
        throw error
    }
}

// Eliminar usuario
exports.deleteUser = async (id) => {
    try {
        const { error } = await supabase
            .from('usuarios')
            .delete()
            .eq('id', id)

        if (error) throw error
        return true
    } catch (error) {
        console.error('Error en deleteUser:', error)
        throw error
    }
}
