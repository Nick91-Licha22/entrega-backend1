export const errorHandler = (error, req, res, next) => {
    const status = error.status || 500;
    const message = error.message || "Error interno del servidor";
    
    console.error(`[Error Log]: ${message}`);
    
    res.status(status).json({
        status: "error",
        message: message
    });
};