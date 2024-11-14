// backend/config/supabase.js
// El propósito de este archivo es configurar Supabase 
// A través de las variables de entorno SUPABASE_URL y SUPABASE_KEY

const { createClient } = require('@supabase/supabase-js')
const SUPABASE_URL = process.env.SUPABASE_URL
const SUPABASE_KEY = process.env.SUPABASE_KEY

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY)

module.exports = supabase