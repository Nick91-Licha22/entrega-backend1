import { userModel } from '../dao/models/user.model.js';
import Cart from '../dao/models/cart.model.js';
import { createHash, isValidPassword, generateToken } from '../utils.js';
import UserDTO from "../dto/user.dto.js";

export const register = async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (user) return res.status(400).send({ status: "error", error: "El usuario ya existe" });

        const newCart = await Cart.create({ products: [] });

        const newUser = {
            first_name, last_name, email, age,
            password: createHash(password),
            cart: newCart._id 
        };
        await userModel.create(newUser);
        res.send({ status: "success", message: "Usuario registrado con éxito" });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) return res.status(401).send({ status: "error", error: "Credenciales inválidas" });

        if (!isValidPassword(user, password)) return res.status(401).send({ status: "error", error: "Contraseña incorrecta" });

        const token = generateToken(user);
        
        res.cookie('coderCookieToken', token, { maxAge: 60 * 60 * 1000, httpOnly: true })
           .send({ status: "success", message: "Login exitoso" });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
};

export const current = (req, res) => {
    if (!req.user) return res.status(401).send({ status: "error", error: "No hay usuario logueado" });
    
    const userDTO = new UserDTO(req.user.user || req.user);
    res.send({ status: "success", payload: userDTO });
};