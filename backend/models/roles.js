const supabase = require('../config/supabase')

exports.getRoles = async () => {
    try {
        const { data, error } = await supabase
            .from('roles')
            .select('*')
            .order('nombre', { ascending: true })

        if (error) throw error
        return data
    } catch (error) {
        console.error('Error en getRoles:', error)
        throw error
    }
} 