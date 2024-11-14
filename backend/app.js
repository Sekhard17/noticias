// backend/app.js
// Aquí vamos a importar las librerías necesarias para el funcionamiento del servidor
const express = require('express')
const cors = require('cors')

//Aquí importamos las rutas de la aplicación

const authRoutes = require('./routes/authRoutes')
const newsRoutes = require('./routes/newsRoutes')
const commentRoutes = require('./routes/commentRoutes')
const tagRoutes = require('./routes/tagRoutes')
const validationRoutes = require('./routes/validationRoutes')

app.use(express.json())

//Configuración de RUTAS OFICIALES

app.use('/api/auth', authRoutes)
app.use('/api/news', newsRoutes)
app.use('/api/comments', commentRoutes)
app.use('/api/tags', tagRoutes)
app.use('/api/validation', validationRoutes)

module.exports = app // -> Exportamos la APP sin iniciar el servidor