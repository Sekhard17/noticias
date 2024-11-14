const express = require('express');
require('dotenv').config();
const cors = require('cors');
const authRoutes = require('./routes/authRoutes');
const newsRoutes = require('./routes/newsRoutes');
const commentRoutes = require('./routes/commentRoutes');
const tagRoutes = require('./routes/tagRoutes');
const validationRoutes = require('./routes/validationRoutes');
const roleRoutes = require('./routes/roleRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware de logging para todas las peticiones
app.use((req, res, next) => {
    console.log('\n=== NUEVA PETICIÓN RECIBIDA ===');
    console.log('Timestamp:', new Date().toISOString());
    console.log('Método:', req.method);
    console.log('URL:', req.url);
    console.log('Headers:', req.headers);
    console.log('Query:', req.query);
    console.log('Body:', req.body);
    console.log('=== FIN DE INFORMACIÓN DE PETICIÓN ===\n');
    next();
});

// Configuración de CORS con logging
app.use(cors({
    origin: 'http://localhost:4321',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Accept', 'Authorization', 'Access-Control-Allow-Credentials']
}));

console.log('CORS configurado para:', 'http://localhost:4321');

// Middleware para parsear JSON con logging
app.use(express.json());

app.use(express.urlencoded({ extended: true }));

// Agregar middleware para manejar el multipart/form-data
app.use((req, res, next) => {
    if (req.headers['content-type']?.includes('multipart/form-data')) {
        console.log('Procesando multipart/form-data:', {
            method: req.method,
            url: req.url,
            contentType: req.headers['content-type']
        });
    }
    next();
});

// Middleware para logging de errores específicos de fileUpload
app.use((err, req, res, next) => {
    if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({
            error: 'Archivo demasiado grande'
        });
    }
    
    if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res.status(400).json({
            error: 'Archivo no esperado'
        });
    }
    
    next(err);
});

// Rutas con logging
app.use('/api/auth', (req, res, next) => {
    console.log('Petición a auth:', req.path);
    next();
}, authRoutes);

app.use('/api/news', (req, res, next) => {
    console.log('Petición a news:', req.path);
    next();
}, newsRoutes);

app.use('/api/comments', (req, res, next) => {
    console.log('Petición a comments:', req.path);
    next();
}, commentRoutes);

app.use('/api/tags', (req, res, next) => {
    console.log('Petición a tags:', req.path);
    next();
}, tagRoutes);

app.use('/api/validation', (req, res, next) => {
    console.log('Petición a validation:', req.path);
    next();
}, validationRoutes);

app.use('/api/roles', (req, res, next) => {
    console.log('Petición a roles:', req.path);
    next();
}, roleRoutes);

// Manejo de errores global mejorado
app.use((err, req, res, next) => {
    console.error('\n=== ERROR GLOBAL CAPTURADO ===');
    console.error('Timestamp:', new Date().toISOString());
    console.error('Error:', {
        message: err.message,
        stack: err.stack,
        code: err.code,
        status: err.status
    });
    console.error('Request:', {
        method: req.method,
        url: req.url,
        headers: req.headers,
        body: req.body
    });
    console.error('=== FIN DE ERROR GLOBAL ===\n');

    res.status(err.status || 500).json({ 
        message: 'Algo salió mal!',
        error: process.env.NODE_ENV === 'development' ? {
            message: err.message,
            stack: err.stack,
            code: err.code
        } : {}
    });
});

// Iniciar el servidor con logging
app.listen(PORT, () => {
    console.log(`\n=== SERVIDOR INICIADO ===`);
    console.log(`Timestamp: ${new Date().toISOString()}`);
    console.log(`Puerto: ${PORT}`);
    console.log(`Modo: ${process.env.NODE_ENV || 'development'}`);
    console.log(`=== CONFIGURACIÓN COMPLETADA ===\n`);
});