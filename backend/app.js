// backend/app.js
//Aquí importamos las rutas de la aplicación
const express = require('express')
const authRoutes = require('./routes/authRoutes')
const newsRoutes = require('./routes/newsRoutes')
const commentRoutes = require('./routes/commentRoutes')
const tagRoutes = require('./routes/tagRoutes')
const validationRoutes = require('./routes/validationRoutes')

const app = express()
const PORT = process.env.PORT || 3001

//Middleware para parsear JSON
app.use(express.json())

//Configuración de RUTAS OFICIALES

app.use('/api/auth', authRoutes)
app.use('/api/news', newsRoutes)
app.use('/api/comments', commentRoutes)
app.use('/api/tags', tagRoutes)
app.use('/api/validation', validationRoutes)

//Iniciar el servidor

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})