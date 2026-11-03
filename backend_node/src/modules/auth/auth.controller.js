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

        if (typeof email !== 'string' || typeof password !== 'string') {
            return res.status(400).json({
                error: 'Hay datos inválidos.',
                campos: {
                    email: typeof email !== 'string' ? 'El correo tiene que ser texto.' : undefined,
                    password: typeof password !== 'string' ? 'La contraseña tiene que ser texto.' : undefined
                }
            });
        }

        const resultado = await autenticarUsuario(email, password);

        res.status(200).json(resultado);
    } catch (err) {
        if (err.status === 401) {
            return res.status(401).json({ error: err.message });
        }
        next(err);
    }
};

export const sesion = async (req, res, next) => {
    try {
        res.status(200).json({ usuario: req.usuario });
    } catch (err) {
        next(err);
    }
};
