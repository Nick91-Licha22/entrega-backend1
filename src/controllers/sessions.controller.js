import { userService, cartService } from "../repositories/index.js";
import { createHash, isValidPassword, generateToken } from "../utils.js";
import UserDTO from "../dto/user.dto.js";
import jwt from 'jsonwebtoken';
import { sendResetPasswordEmail } from "../services/mailing.js";

export const register = async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        const exists = await userService.getUserByEmail(email);
        if (exists) return res.status(400).send({ status: "error", error: "Usuario ya existe" });

        const newCart = await cartService.createCart();
        const user = {
            first_name, last_name, email, age,
            password: createHash(password),
            cart: newCart._id,
            role: 'user'
        };

        await userService.createUser(user);
        res.send({ status: "success", message: "Usuario registrado" });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
};

export const login = async (req, res) => {
    if (!req.user) return res.status(400).send({ status: "error", error: "Credenciales inválidas" });
    const token = generateToken(req.user);
    res.cookie('coderCookieToken', token, { maxAge: 3600000, httpOnly: true }).send({ status: "success" });
};

export const current = async (req, res) => {
    const userDTO = new UserDTO(req.user);
    res.send({ status: "success", payload: userDTO });
};

export const logout = (req, res) => {
    res.clearCookie('coderCookieToken').redirect('/login');
};

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await userService.getUserByEmail(email);
    if (!user) return res.status(404).send({ status: "error", error: "Usuario no encontrado" });
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const link = `http://localhost:8080/reset-password?token=${token}`;
    await sendResetPasswordEmail(email, link);
    res.send({ status: "success", message: "Email enviado" });
};

export const resetPassword = async (req, res) => {
    const { token, password } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userService.getUserByEmail(decoded.email);
        if (isValidPassword(user, password)) return res.status(400).send({ status: "error", error: "Misma contraseña" });
        user.password = createHash(password);
        await userService.updateUser(user._id, user);
        res.send({ status: "success", message: "Clave actualizada" });
    } catch (error) {
        res.status(400).send({ status: "error", error: "Token inválido" });
    }
};