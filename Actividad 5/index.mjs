import express from 'express';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import pool from './conexion.bd.mjs';

const PUERTO = 3000;

const app = express();

// MIDDLEWARES

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/login', express.static('./fronts/front-login'));
// Middleware para proteger la ruta /admin
app.use('/admin', async (req, res, next) => {

    const sesionId = req.cookies.sessionId;

    if (!sesionId) {
        return res.redirect('/login');
    }

    try {
        
        const resultado = await pool.query(
            'SELECT session_id FROM usuarios WHERE session_id = $1',
            [sesionId]
        );

        if (resultado.rowCount === 0) {
            
            return res.redirect('/login');
        }

        next();

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
}, express.static('./fronts/front-admin'));


// Ruta para el registro de usuarios
app.post('/registrar', async (req, res) => {
    const { usuario, pass } = req.body;
    
    if (!usuario || !pass) {
        return res.status(400).json({ 
            mensaje: 'Datos incompletos, se requiere usuario y contraseña'
        });
    }

    try {
        
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(pass, salt);

        
        const resultado = await pool.query(
            'INSERT INTO usuarios (username, password_hash) VALUES ($1, $2) RETURNING id, username',
            [usuario, hash]
        );

        if (resultado.rowCount > 0) {
            
            return res.redirect('/login');
        }

        res.status(500).json({ mensaje: 'No se pudo registrar el usuario' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
});

// Ruta de autenticación login
app.post('/autenticar', async (req, res) => {
    const { usuario, pass } = req.body;

    
    if (!usuario || !pass) {
        return res.status(400).json({ mensaje: 'Datos incompletos, se requiere usuario y contraseña' });
    }

    try {
        
        const resultado = await pool.query(
            'SELECT password_hash FROM usuarios WHERE username = $1',
            [usuario]
        );

        if (resultado.rowCount === 0) {
            return res.status(401).json({ mensaje: 'Usuario o contraseña incorrectos' });
        }

        const hashGuardado = resultado.rows[0].password_hash;
        const verificado = await bcrypt.compare(pass, hashGuardado);

        if (!verificado) {
            return res.status(401).json({ mensaje: 'Usuario o contraseña incorrectos' });
        }


        const sesionId = nanoid(21);

        await pool.query(
            'UPDATE usuarios SET session_id = $1 WHERE username = $2',
            [sesionId, usuario]
        );

        res.cookie('sessionId', sesionId, {
            httpOnly: true,
            sameSite: 'Strict',
            maxAge: 24 * 60 * 60 * 1000
        });


        res.redirect('/admin');

    } catch (error) {
        console.error(error);
        res.status(500).json({ mensaje: 'Error en el servidor' });
    }
});


app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});
