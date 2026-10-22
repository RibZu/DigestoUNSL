import { autenticarUsuario } from './auth.service.js';

export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({
                error: 'Hay datos inválidos.',
                campos: {
                    email: !email ? 'El correo es obligatorio.' : undefined,
                    password: !password ? 'La contraseña es obligatoria.' : undefined
                }
            });
        }

        // Ejecutar la autenticación en el servicio
        const resultado = await autenticarUsuario(email, password);

        // Respuesta exitosa 200 OK con el token y los datos de la cuenta
        res.status(200).json(resultado);
    } catch (err) {
        // Si el servicio arrojó un error 401 controlado (credenciales malas o baja lógica)
        if (err.status === 401) {
            return res.status(401).json({ error: err.message });
        }
        next(err); // Deriva al middleware global de errores
    }
};

export const sesion = async (req, res, next) => {
    try {
        res.status(200).json({ usuario: req.usuario });
    } catch (err) {
        next(err);
    }
};