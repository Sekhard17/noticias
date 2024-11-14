// backend/config/supabase.js
// El propósito de este archivo es configurar Supabase 
// A través de las variables de entorno SUPABASE_URL y SUPABASE_KEY

const { createClient } = require('@supabase/supabase-js')
require('dotenv').config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY

console.log('Verificando configuración Supabase:')
console.log('URL:', supabaseUrl)
console.log('Key existe:', !!supabaseKey)

if (!supabaseUrl || !supabaseKey) {
    throw new Error('Faltan las credenciales de Supabase en las variables de entorno')
}

const supabase = createClient(supabaseUrl, supabaseKey)

module.exports = supabase