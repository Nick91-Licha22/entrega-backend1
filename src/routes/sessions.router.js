import { Router } from 'express';
import { userModel } from '../dao/models/user.model.js';
import { cartModel } from '../dao/models/cart.model.js';
import { createHash, isValidPassword } from '../utils.js';
import jwt from 'jsonwebtoken';
import { passportCall } from '../utils.js';

const router = Router();

router.post('/register', async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        
        const exists = await userModel.findOne({ email });
        if (exists) return res.status(400).send({ status: "error", error: "El usuario ya existe" });

        const newCart = await cartModel.create({ products: [] });

        const user = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            cart: newCart._id 
        };

        await userModel.create(user);
        res.send({ status: "success", message: "Usuario registrado con éxito" });
    } catch (error) {
        res.status(500).send({ status: "error", error: "Error al registrar usuario" });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        const user = await userModel.findOne({ email }).lean();
        
        if (!user) return res.status(401).send({ status: "error", error: "Usuario no encontrado" });

        if (!isValidPassword(user, password)) {
            return res.status(403).send({ status: "error", error: "Contraseña incorrecta" });
        }

        const token = jwt.sign(
            { 
                id: user._id, 
                first_name: user.first_name, 
                last_name: user.last_name, 
                email: user.email, 
                cart: user.cart,
                role: user.role 
            }, 
            'CoderSecretKeySYN', 
            { expiresIn: '24h' }
        );

        
        res.cookie('coderCookieToken', token, { 
            httpOnly: true, 
            maxAge: 60 * 60 * 1000 * 24 
        }).send({ status: "success", message: "Login exitoso" });

    } catch (error) {
        res.status(500).send({ status: "error", error: "Error al iniciar sesión" });
    }
});


router.get('/logout', (req, res) => {
    res.clearCookie('coderCookieToken').redirect('/login');
});

router.get('/current', passportCall('jwt'), (req, res) => {
    res.send({ status: "success", payload: req.user });
});

export default router;