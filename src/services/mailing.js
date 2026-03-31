import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS
    }
});

export const sendResetPasswordEmail = async (email, link) => {
    try {
        await transporter.sendMail({
            from: `S&N Verdulería 🍎 <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Restablecer tu contraseña',
            html: `
                <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee;">
                    <h1 style="color: #28a745;">S&N Verdulería</h1>
                    <p>Hacé click en el botón para cambiar tu clave. <strong>Vence en 1 hora.</strong></p>
                    <a href="${link}" style="background: #ffc107; color: black; padding: 10px 20px; text-decoration: none; font-weight: bold; border-radius: 5px; display: inline-block;">
                        CAMBIAR CONTRASEÑA
                    </a>
                </div>
            `
        });
        return { success: true };
    } catch (error) {
        console.error("Error en el servicio de mail:", error);
        return { success: false, error };
    }
};