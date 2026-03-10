import { Router } from "express";
import { sendRecoveryMail } from "../services/mailing.js";
import { generateResetToken, createHash, isValidPassword } from "../utils.js";
import userModel from "../dao/models/user.model.js";
import jwt from "jsonwebtoken";

const router = Router();

router.post("/forgot-password", async (req, res) => {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) return res.status(404).send({ status: "error", message: "Usuario no encontrado" });

    const token = generateResetToken(email);
    const link = `${process.env.BASE_URL}/reset-password?token=${token}`;
    
    await sendRecoveryMail(email, link);
    res.send({ status: "success", message: "Mail de recuperación enviado" });
});

router.post("/reset-password", async (req, res) => {
    const { token, password } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretKey');
        const email = decoded.email;
        const user = await userModel.findOne({ email });
        if (isValidPassword(user, password)) {
            return res.status(400).send({ status: "error", message: "No podés usar la misma contraseña que ya tenías." });
        }

        user.password = createHash(password);
        await user.save();
        res.send({ status: "success", message: "Contraseña actualizada correctamente" });

    } catch (error) {
        res.status(400).send({ status: "error", message: "El link expiró o es inválido. Solicitá uno nuevo." });
    }
});

export default router;