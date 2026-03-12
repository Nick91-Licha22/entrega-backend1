import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS  
    }
});

export const sendRecoveryMail = async (email, link) => {
    return await transporter.sendMail({
        from: "S&N Verdulería <no-reply@syn.com>",
        to: email,
        subject: "Restablecer Contraseña - S&N Verdulería",
        html: `
            <div style="font-family: Arial, sans-serif; border: 1px solid #198754; padding: 20px;">
                <h2 style="color: #198754;">Recuperación de Contraseña</h2>
                <p>Hacé clic en el siguiente botón para restablecer tu clave. Este link expira en 1 hora.</p>
                <a href="${link}" style="display: inline-block; background-color: #198754; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Restablecer Clave</a>
            </div>
        `
    });
};