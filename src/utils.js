import passport from 'passport';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export const PRIVATE_KEY = process.env.JWT_SECRET || "CoderSecretKeySecretisima";
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
        passport.authenticate(strategy, function (err, user, info) {
            if (err) return next(err);
            if (!user) {
                return res.status(401).send({
                    error: info.messages ? info.messages : info.toString()
                });
            }
            req.user = user;
            next();
        })(req, res, next);
    };
};