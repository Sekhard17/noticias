// backend/server.js
// Aquí vamos a iniciar el servidor de Node.js

const app = require('./app')
const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`)
})