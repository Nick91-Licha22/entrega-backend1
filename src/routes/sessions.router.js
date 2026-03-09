import { Router } from 'express';
import { userModel } from '../dao/models/user.model.js';
import Cart from '../dao/models/cart.model.js'; 
import { createHash, isValidPassword, generateToken } from '../utils.js';
import passport from 'passport';
import UserDTO from "../dto/user.dto.js";
const router = Router();

router.post('/register', async (req, res) => {
    const { first_name, last_name, email, age, password } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (user) return res.status(400).send({ status: "error", error: "User already exists" });

        const newCart = await Cart.create({ products: [] });

        const newUser = {
            first_name, last_name, email, age,
            password: createHash(password),
            cart: newCart._id 
        };
        await userModel.create(newUser);
        res.send({ status: "success", message: "User registered" });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.status(401).send({ status: "error", error: "Invalid credentials" });

    if (!isValidPassword(user, password)) return res.status(401).send({ status: "error", error: "Wrong password" });

    const token = generateToken(user);
    
    res.cookie('coderCookieToken', token, { maxAge: 60 * 60 * 1000, httpOnly: true })
       .send({ status: "success", message: "Logged in" });
});

router.get('/current', passportCall('jwt'), (req, res) => {
    const userDTO = new UserDTO(req.user); 

    res.send({ status: "success", payload: userDTO });
});


export default router;