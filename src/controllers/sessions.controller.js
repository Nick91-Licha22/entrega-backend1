import jwt from 'jsonwebtoken';
import { userService } from "../repositories/index.js"; 
import { sendRecoveryMail } from "../services/mail.service.js";

export const requestPasswordReset = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await userService.getUserByEmail(email);
        if (!user) return res.status(404).send({ status: "error", error: "Usuario no encontrado" });

        const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });

        const resetLink = `http://localhost:8080/reset-password?token=${token}`;

        await sendRecoveryMail(email, resetLink);

        res.send({ status: "success", message: "Correo de recuperación enviado con éxito." });
    } catch (error) {
        res.status(500).send({ status: "error", error: error.message });
    }
};