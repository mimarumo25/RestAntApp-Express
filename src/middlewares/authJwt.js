import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv'

dotenv.config()

export const verfyToken = async (req, res, next) => {
    try {
        const token = req.headers["x-access-token"];

        if (!token) return res.status(501).json({ mesage: "No token provided" })

        const decode = jwt.verify(token, process.env.JWT_SECRET)
        req.userId = decode.id;
        const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [req.userId]);
        if (!user) return res.status(404).json({ message: "No user found" })
        next();
    } catch (error) {
        console.log("error al validar el token" + error);
        return res.status(401).json({ message: "Unauthorized" });
    }
}

export const isAdmin = async (req, res, next) => {
    const [rows, fields] = await db.execute('SELECT * FROM usuarios WHERE id = ?', [req.userId]);
    const user = rows[0];
    if (!user || user.tipo !== 'admin') {
        return res.status
    }
}
export const generarToken = (user) => {

    const payload = {
        id: user.id,
        name: user.persona_id,
        email: user.correo
    };

    const options = {
        expiresIn: '30m'
    };
    return jwt.sign(payload, process.env.JWT_SECRET, options);
}
export const verifyPassword = async (email, password) => {
    const [rows, fields] = await db.execute('SELECT * FROM usuarios WHERE correo = ?', [email]);
    const user = rows[0];
    if (!user) {
        return false;
    }
    const isValid = await bcrypt.compare(password, user.contraseña);
    if (!isValid) {
        return false;
    }
    return user;
}

//Encriptar password
export const encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10)
    return await bcrypt.hash(password, salt)
}
export const comparePasword = async (password, receivedPassword) => {
    return await bcrypt.compare(password, receivedPassword)
}