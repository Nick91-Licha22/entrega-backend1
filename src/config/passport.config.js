import passport from 'passport';
import local from 'passport-local';
import jwt from 'passport-jwt';
import { userService } from '../repositories/index.js';
import { isValidPassword } from '../utils.js';

const LocalStrategy = local.Strategy;
const JWTStrategy = jwt.Strategy;
const ExtractJWT = jwt.ExtractJwt;

const cookieExtractor = req => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['coderCookieToken'];
    }
    return token;
};

const initializePassport = () => {
    passport.use('login', new LocalStrategy({
        usernameField: 'email'
    }, async (email, password, done) => {
        try {
            const user = await userService.getUserByEmail(email);
            if (!user) {
                return done(null, false, { message: "Usuario no encontrado" });
            }
            if (!isValidPassword(user, password)) {
                return done(null, false, { message: "Contraseña incorrecta" });
            }
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));

    passport.use('jwt', new JWTStrategy({
        jwtFromRequest: ExtractJWT.fromExtractors([cookieExtractor]),
        secretOrKey: process.env.JWT_SECRET || 'CoderSecretKeySYN'
    }, async (jwt_payload, done) => {
        try {
            const user = jwt_payload.user ? jwt_payload.user : jwt_payload;
            return done(null, user);
        } catch (error) {
            return done(error);
        }
    }));
};

export default initializePassport;