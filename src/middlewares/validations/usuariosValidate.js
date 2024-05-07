import { check, validationResult } from "express-validator";

export const usuarioValidate = [
  check('identificacion').isLength({ min: 1, max: 11 }),
  check('tipoIdentificacionId').isInt(),
  check('nombres').isLength({ min: 1, max: 50 }),
  check('apellidos').isLength({ min: 1, max: 50 }),
  check('sexoId').isInt(),
  check('telefono').isLength({ min: 1, max: 13 }),
  check('direccion').isLength({ min: 1, max: 100 }),
  check('departamentoId').isInt(),
  check('municipioId').isInt(),
  check('empresasId').isInt(),
  check('tipoPersonaId').isInt(),
  check('correo').isEmail(),
  check('password').isLength({ min: 6, max: 20 }),
  check('estado').isInt(),

  // middleware que maneja el resultado de las validaciones
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  }
];
export const LoginValidate = [

  check('correo').isEmail(),
  check('password').isLength({ min: 6, max: 20 }),

  // middleware que maneja el resultado de las validaciones
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
    next();
  }
];

