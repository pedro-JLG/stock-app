const DUPLICATE_MESSAGES = {
    sku: 'El SKU ya está en uso',
    email: 'Correo ya registrado',
};

export function errorHandler(err, req, res, next) {
    // Mongo duplicate key (unique index violated)
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern || {})[0];
        return res.status(409).json({
            message: DUPLICATE_MESSAGES[field] || 'El registro ya existe',
        });
    }

    // Malformed JSON body (thrown by express.json)
    if (err.type === 'entity.parse.failed') {
        return res.status(400).json({ message: 'JSON inválido' });
    }

    const status = err.status || 500;

    if (status === 500) {
        console.error(err);
    }

    res.status(status).json({
        message: status === 500 ? 'Error interno del servidor' : err.message,
    });
}
