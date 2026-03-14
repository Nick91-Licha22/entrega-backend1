import { fileURLToPath } from 'url';
import { dirname } from 'path';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default __dirname;

export const PRIVATE_KEY = process.env.JWT_SECRET || "CoderSecretKeySYN";

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) => {
    if (!user || !user.password) return false;
    return bcrypt.compareSync(password, user.password);
};

export const generateResetToken = (email) => {
    return jwt.sign({ email }, PRIVATE_KEY, { expiresIn: '1h' });
};

export const passportCall = (strategy) => {
    return async (req, res, next) => {
        passport.authenticate(strategy, { session: false }, function (err, user, info) {
            if (err) return next(err);
            if (!user) {
                return res.status(401).send({
                    error: info ? (info.messages || info.toString()) : "No autorizado"
                });
            }
            req.user = user;
            next();
        })(req, res, next);
    };
};