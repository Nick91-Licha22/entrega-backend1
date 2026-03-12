import { Router } from "express";
import { userModel } from "../dao/models/user.model.js";
import { createHash, isValidPassword, generateResetToken, passportCall } from "../utils.js";
import { sendRecoveryMail } from "../services/mailing.js";
import UserDTO from "../dto/user.dto.js";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/register", async (req, res) => {
    try {
        const { first_name, last_name, email, age, password } = req.body;
        
        const exists = await userModel.findOne({ email });
        if (exists) return res.status(400).send({ status: "error", error: "El email ya está registrado" });

        const newUser = {
            first_name,
            last_name,
            email,
            age,
            password: createHash(password),
            role: 'user' 
        };

        await userModel.create(newUser);
        res.send({ status: "success", message: "Usuario creado" });
    } catch (error) {
        res.status(500).send({ status: "error", error: "Error interno del servidor" });
    }
});

router.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email });

        if (!user || !isValidPassword(user, password)) {
            return res.status(401).send({ status: "error", error: "Credenciales inválidas" });
        }

        const token = jwt.sign({ user: new UserDTO(user) }, process.env.JWT_SECRET || "CoderSecretKeySecretisima", { expiresIn: '24h' });

        res.cookie('coderCookie', token, { httpOnly: true }).send({ status: "success", message: "Login exitoso" });
    } catch (error) {
        res.status(500).send({ status: "error", error: "Error en el login" });
    }
});

router.get("/current", passportCall('jwt'), (req, res) => {
    const userDTO = new UserDTO(req.user);
    res.send({ status: "success", payload: userDTO });
});

router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    try {
        const user = await userModel.findOne({ email });
        if (!user) return res.status(404).send({ status: "error", message: "Usuario no encontrado" });

        const token = generateResetToken(email);
        const link = `${process.env.BASE_URL || 'http://localhost:8080'}/reset-password?token=${token}`;
        
        await sendRecoveryMail(email, link);
        res.send({ status: "success", message: "Mail de recuperación enviado con éxito" });
    } catch (error) {
        res.status(500).send({ status: "error", message: "Error al procesar solicitud" });
    }
});

router.post("/reset-password", async (req, res) => {
    const { token, password } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "CoderSecretKeySecretisima");
        const user = await userModel.findOne({ email: decoded.email });

        if (isValidPassword(user, password)) {
            return res.status(400).send({ status: "error", message: "No podés usar la misma contraseña que ya tenías" });
        }

        user.password = createHash(password);
        await user.save();
        res.send({ status: "success", message: "Contraseña actualizada" });
    } catch (error) {
        res.status(400).send({ status: "error", message: "El link expiró o es inválido" });
    }
});

export default router;