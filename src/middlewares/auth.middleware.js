export const authorization = (roles) => {
    return async (req, res, next) => {
        if (!req.user) return res.status(401).send({ error: "No autorizado" });
        
        if (!roles.includes(req.user.role)) {
            return res.status(403).send({ error: "No tienes permisos (Requiere: " + roles + ")" });
        }
        next();
    };
};