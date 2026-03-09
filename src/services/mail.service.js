import nodemailer from 'nodemailer';

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
        from: 'SYN Verdulería <tu-mail@gmail.com>',
        to: email,
        subject: 'Restablecer tu contraseña',
        html: `
            <h1>Restablecer Contraseña</h1>
            <p>Hacé click en el botón para cambiar tu clave. Recordá que vence en 1 hora.</p>
            <a href="${link}" style="background-color: green; color: white; padding: 10px; text-decoration: none; border-radius: 5px;">
                Restablecer Contraseña
            </a>
        `
    });
};