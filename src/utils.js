import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config(); 

export const PRIVATE_KEY = process.env.JWT_SECRET || "ClaveScretaDeRespaldo";

export const createHash = password => bcrypt.hashSync(password, bcrypt.genSaltSync(10));

export const isValidPassword = (user, password) => bcrypt.compareSync(password, user.password);

export const generateToken = (user) => {
    
    return jwt.sign({ user }, PRIVATE_KEY, { expiresIn: '24h' });
};