import { sendResetPasswordEmail } from "../services/mailing.js";
import { createHash, isValidPassword } from "../utils.js";
import jwt from 'jsonwebtoken';

export const forgotPassword = async (req, res) => {
    const { email } = req.body;
    const user = await userService.getUserByEmail(email);
    if (!user) return res.status(404).send({ status: "error", error: "Usuario no encontrado" });

    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    const link = `http://localhost:8080/reset-password?token=${token}`;

    await sendResetPasswordEmail(email, link);
    res.send({ status: "success", message: "Email enviado correctamente" });
};

export const resetPassword = async (req, res) => {
    const { token, password } = req.body;

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await userService.getUserByEmail(decoded.email);

        if (isValidPassword(user, password)) {
            return res.status(400).send({ status: "error", error: "No puedes usar la misma contraseña anterior" });
        }

        user.password = createHash(password);
        await userService.updateUser(user._id, user);
        res.send({ status: "success", message: "Contraseña actualizada" });

    } catch (error) {
        res.status(400).send({ status: "error", error: "El link expiró o es inválido. Solicita uno nuevo." });
    }
};