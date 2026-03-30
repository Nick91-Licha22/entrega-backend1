import { userService, cartService } from "../repositories/index.js";
import { createHash, isValidPassword, generateToken, generateResetToken, PRIVATE_KEY } from "../utils.js";
import { sendRecoveryMail } from "../services/mailing.js";
import UserDTO from "../dto/user.dto.js"; 
import jwt from 'jsonwebtoken';

export const register = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        
        const exists = await userService.getUserByEmail(email);
        if (exists) return res.status(400).send({ status: "error", error: "El usuario ya existe" });

        const newCart = await cartService.createCart(); 

        const user = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            cart: newCart._id,
            role: 'user'
        };

        await userService.createUser(user);
        res.send({ status: "success", message: "Usuario registrado" });
    } catch (error) {
        console.error("DETALLE DEL ERROR EN REGISTRO:", error);
        res.status(500).send({ status: "error", error: error.message });
    }
};

export const login = async (req, res) => {
    try {
        if (!req.user) return res.status(400).send({ status: "error", error: "Credenciales inválidas" });
        
        const token = generateToken(req.user);
        res.cookie('coderCookieToken', token, { maxAge: 60 * 60 * 1000, httpOnly: true })
           .send({ status: "success", payload: req.user });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
};

export const current = async (req, res) => {
    try {
        const userDTO = new UserDTO(req.user);
        res.send({ status: "success", payload: userDTO });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
};

export const requestRecovery = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await userService.getUserByEmail(email);
        if (!user) return res.status(404).send({ status: "error", error: "Usuario no encontrado" });

        const token = generateResetToken(email);
        const link = `http://localhost:8080/reset-password?token=${token}`;
        
        await sendRecoveryMail(email, link);
        res.send({ status: "success", message: "Mail de recuperación enviado" });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
};

export const resetPassword = async (req, res) => {
    const { token, password } = req.body;
    try {
        const decoded = jwt.verify(token, PRIVATE_KEY);
        const email = decoded.email;
        const user = await userService.getUserByEmail(email);

        if (isValidPassword(user, password)) {
            return res.status(400).send({ status: "error", message: "No podés usar la misma contraseña anterior" });
        }

        const newHashedPassword = createHash(password);
        await userService.updateUser(user._id, { password: newHashedPassword });
        
        res.send({ status: "success", message: "Contraseña actualizada correctamente" });
    } catch (error) {
        res.status(400).send({ status: "error", message: "El token es inválido o expiró" });
    }
};

export const logout = (req, res) => {
    res.clearCookie('coderCookieToken').redirect('/login');
};