import express from "express";
//import { checkDuplicateUsernameOrEmail, checkRolesExisted } from "../middlewares/verifySigUp.js";
import { signIn, signUp, updatePassword, validaEmail } from "../controllers/auth.controller.js"
import { usuarioValidate,LoginValidate } from "../middlewares/validations/usuariosValidate.js";

const router = express.Router();

router.post('/signup', usuarioValidate,signUp)
router.post('/signin',LoginValidate,signIn)
router.post('/validaIdentidad',validaEmail)
router.post('/reset-password/:token',updatePassword)


export default router 