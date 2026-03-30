import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export const PRIVATE_KEY = process.env.JWT_SECRET || "CoderSecretKeySYN";

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));
export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

export const generateToken = (user) => jwt.sign({ user }, PRIVATE_KEY, { expiresIn: '24h' });
export const generateResetToken = (email) => jwt.sign({ email }, PRIVATE_KEY, { expiresIn: '1h' });

export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, { session: false }, function (err, user, info) {
            if (err) return next(err);
            if (!user) return res.status(401).send({ error: info.messages ? info.messages : info.toString() });
            req.user = user;
            next();
        })(req, res, next);
    };
};

export const authorization = (roles) => {
    return async (req, res, next) => {
        if (!req.user) return res.status(401).send({ error: "No autorizado" });
        if (!roles.includes(req.user.role)) {
            return res.status(403).send({ error: "Acceso denegado: permisos insuficientes" });
        }
        next();
    };
};

export default __dirname;