const jwt = require('jsonwebtoken');

exports.authenticateToken = async (req, res, next) => {
    try {
        console.log('=== Verificando Token ===');
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        
        console.log('Token recibido:', token ? token.substring(0, 20) + '...' : 'No presente');

        if (!token) {
            console.log('No se proporcionó token');
            return res.status(401).json({ 
                error: "Acceso denegado", 
                message: "Token no proporcionado" 
            });
        }

        jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
            if (err) {
                console.log('Error al verificar token:', err);
                return res.status(403).json({ 
                    error: "Acceso denegado", 
                    message: "Token inválido" 
                });
            }
            
            console.log('Usuario decodificado:', {
                id: user.id,
                rol_id: user.rol_id,
                email: user.email
            });
            
            req.user = user;
            next();
        });
    } catch (error) {
        console.error('Error en authenticateToken:', error);
        res.status(500).json({ 
            error: "Error de autenticación", 
            message: error.message 
        });
    }
};

exports.checkRole = (allowedRoles) => {
    return (req, res, next) => {
        console.log('=== Verificando Rol ===');
        console.log('Roles permitidos:', allowedRoles);
        console.log('Rol del usuario:', req.user?.rol_id);
        
        if (!req.user) {
            console.log('No hay usuario en la request');
            return res.status(401).json({ 
                error: "Acceso denegado", 
                message: "Usuario no autenticado" 
            });
        }

        // Convertir roles a números para comparación
        const roleMapping = {
            'admin': 1,
            'editor': 2,
            'escritor': 3
        };

        const userRoleId = parseInt(req.user.rol_id);
        const hasPermission = allowedRoles.some(role => {
            const requiredRoleId = roleMapping[role];
            console.log(`Comparando rol usuario ${userRoleId} con rol requerido ${requiredRoleId}`);
            return userRoleId === requiredRoleId;
        });

        console.log('¿Tiene permiso?:', hasPermission);

        if (!hasPermission) {
            console.log('Usuario no tiene permisos suficientes');
            return res.status(403).json({ 
                error: "Acceso denegado", 
                message: "No tiene permisos suficientes",
                debug: {
                    userRole: userRoleId,
                    allowedRoles: allowedRoles,
                    mappedRoles: allowedRoles.map(r => roleMapping[r])
                }
            });
        }

        next();
    };
}; 