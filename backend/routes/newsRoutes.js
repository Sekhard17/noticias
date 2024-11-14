const express = require('express')
const router = express.Router()
const multer = require('multer')
const path = require('path')
const newsController = require('../controllers/newsController')
const { authenticateToken, checkRole } = require('../middleware/auth')

// Configuración de multer
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, '/tmp/')
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname))
    }
})

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024
    }
})

// Rutas protegidas
router.get('/', authenticateToken, newsController.getNews)
router.post('/', 
    authenticateToken, 
    checkRole(['admin', 'editor', 'escritor']), 
    upload.single('imagen'), 
    newsController.createNews
)
router.put('/:id', 
    authenticateToken, 
    checkRole(['admin', 'editor']), 
    newsController.updateNews
)
router.delete('/:id', 
    authenticateToken, 
    checkRole(['admin']), 
    newsController.deleteNews
)
router.get('/:id', authenticateToken, newsController.getNewsById)

module.exports = router