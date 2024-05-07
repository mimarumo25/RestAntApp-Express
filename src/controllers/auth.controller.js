import { pool } from "../database/database.js"
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer"
import * as dotenv from 'dotenv'
import { encryptPassword, comparePasword, generarToken } from "../middlewares/authJwt.js";
dotenv.config()
export const signUp = async (req, res) => {
    try {
        const {
            identificacion,
            tipoIdentificacionId,
            nombres,
            apellidos,
            sexoId,
            telefono,
            direccion,
            departamentoId,
            municipioId,
            empresasId,
            tipoPersonaId,
            correo,
            password,
            estado,
            roles
        } = req.body;
        const [rows] = await pool.query('INSERT INTO personas (identificacion, tipo_IdentificacionId, nombres, apellidos, sexoId, telefono, direccion, departamentos_id, municipios_id, empresasId, tipo_persona_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)', [identificacion, tipoIdentificacionId, nombres, apellidos, sexoId, telefono, direccion, departamentoId, municipioId, empresasId, tipoPersonaId])
        const personaId = rows.insertId;
        const passwordBd = await encryptPassword(password);
        const [result] = await pool.query('INSERT INTO usuarios (persona_id, correo, password, estados_id) VALUES (?, ?, ?, ?)', [personaId, correo, passwordBd, estado])
        const usuariosId = result.insertId
        for (const rol in roles) {
            await pool.query('INSERT INTO usuarios_roles (usuario_id, rol_id)VALUES(?, ?)', [usuariosId, roles[rol]])
        }
        res.status(200).json({ message: "Usuario Creado Exitosamente" });
    } catch (error) {
        if (error.message.indexOf("Duplicate entry") !== -1) {
            res.status(409).json({ Error: error.message })
        } else {
            res.status(500).json({ Error: error })
        }

    }


}
export const signIn = async (req, res) => {
    try {
        const { correo, password } = req.body
        const [rows] = await pool.query('SELECT * FROM usuarios WHERE correo = ?', [correo]);
        if (rows.length <= 0) return res.status(404).json({ message: 'Email y/o Password incorrecto' })
        const passValida = await comparePasword(password, rows[0].password)
        if (!passValida) return res.status(404).json({ message: 'Email y/o Password incorrecto' })
        const token = generarToken(rows[0])
        res.json({ token: token })
    } catch (error) {
        res.status(500).json({ Error: error })
    }
}



export const validaEmail = async (req, res) => {
    try {
        const { correo } = req.body;
        const [rows] = await pool.query('SELECT id, persona_id, correo FROM usuarios WHERE correo = ?', [correo]);

        if (rows.length <= 0) return res.status(404).json({ message: 'Correo electrónico no encontrado' });
        const token = generarToken(rows[0]);

        // Enviar el enlace de restablecimiento de contraseña por correo electrónico
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false,
            auth: {
                user: process.env.GMAIL_USER,
                pass: process.env.GMAIL_PASSWORD,
            },
        });
        const resetPasswordLink = `${process.env.CLIENT_URL}/reset-password/${token}`;

        const mailOptions = {
            from: `RestAntApp <tuapp@gmail.com>`,
            to: correo,
            subject: 'Restablecer contraseña',
            html: `
        <html>
          <head>
            <style>
              body {
                font-family: Arial, sans-serif;
                background-color: #f2f2f2;
              }
              p {
                font-size: 16px;
                line-height: 1.5em;
                color: #333333;
                margin-bottom: 16px;
              }
              a {
                color: #007bff;
                text-decoration: none;
              }
              a:hover {
                text-decoration: underline;
              }
            </style>
          </head>
          <body>
            <p>Hola,</p>
            <p>Recibimos una solicitud para restablecer su contraseña. Haga clic en el siguiente enlace para continuar:</p>
            <a href="${resetPasswordLink}">${resetPasswordLink}</a>
            <p>Este enlace expirará en 1 hora.</p>
            <p>Si no solicitó el restablecimiento de su contraseña, puede ignorar este mensaje.</p>
            <p>Gracias.</p>
          </body>
        </html>
      `
        };
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                return res.status(500).json({ message: 'Ha ocurrido un error al enviar el correo electrónico de restablecimiento de contraseña.' });
            }
            return res.status(200).json({ message: 'Correo electrónico de restablecimiento de contraseña enviado.' });
        });
    }
    catch (error) {
        return res.status(500).json({ message: 'Error Interno del servidor.' });
    }
}

export const updatePassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)
        console.log(decoded);
        if (!decoded.email) {
            return res.status(400).json({ message: 'Token no válido.' });
        }
        const [rows] = await pool.query('SELECT id, persona_id, correo FROM usuarios WHERE correo = ?', [decoded.email]);
        if (rows.length <= 0) {
            return res.status(404).json({ message: 'Usuario no encontrado.' });
        }
        const hashedPassword = await encryptPassword(password)
        const id = rows[0].id;
        console.log(hashedPassword);
        await pool.query('UPDATE usuarios SET password = ? WHERE id = ?', [hashedPassword, id]);
        return res.status(200).json({ message: 'Contraseña restablecida exitosamente.' });
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            // Si la excepción es TokenExpiredError, devolver un mensaje personalizado
            return res.status(401).json({ message: 'El token ha expirado' });
        } else {
            console.log(error);
            return res.status(500).json({ message: 'Ha ocurrido un error al restablecer la contraseña.', error });
        }
    }
}