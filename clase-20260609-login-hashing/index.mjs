import express from 'express';
import bcrypt from 'bcryptjs'
import pool from './conexion.bd.mjs';

const PUERTO = 3000

////////////////

////////////////
const app = express();

app.use(express.json()) 
app.use(express.urlencoded({extended: true}))

//Hacer publicas las carpetas para acceder al navegador
//-> /admin -> peticion (./fronts/front-admin)
app.use('/admin',express.static('./fronts/front-admin'))
//-> /login -> peticion (./fronts/front-login)
app.use('/login',express.static('./fronts/front-login'))


//Configurar rutas login y registro

app.post('/autenticar', (req, res)=>{

})

app.post('/registrar', async(req, res)=>{
    //1- Obtengo los datos del formulario
    //req.body.usuario
    //req.body.pass
    const {usuario, pass} = req.body

    //2- Chequear datos
    if(!usuario || !pass){
        return res.status(400).json({
            mensaje: "datos incompletos"
        })
    } 

    //3- Hasting
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash("B4c0/\/", salt);

    const resultado = await pool.query(`
        INSERT INTO usuarios
            (username, password_hash)
        VALUES
            ($1,$2)
        RETURNING id, username
        `,
        [
            usuario,
            hash
        ]
    )
    if(resultado.rowCount > 0){
        return res.status(201).json({mensaje: 'usuario registrado', usuario: resultado.rows[0].username})
    }

    res.status(200).json({
        mensaje: 'NO SE PUDO'
    })

})





app.listen(PUERTO, () => {
    console.log(`Servidor escuchando en el puerto ${PUERTO}`);
});
