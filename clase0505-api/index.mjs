import express from 'express'
import {obtenerProductoporid, obtenerProductos,eliminarProducto, cargarProducto, modificarProducto} from './funciones.mjs'

//BD---


const PUERTO=3000

const app = express()
app.use(express.json()) //<--avisa a express q parsee los datos en json del cuerpo del mensaje http

//definimos una api rest

//get /api/v1/productos -> todos
app.get('/api/v1/productos', obtenerProductos) //obtener productos se ejecuta cuando hay una peticion(get,api,v1..)


//get /api/v1/productos/:id -> uno por id
app.get('/api/v1/productos/:id',obtenerProductoporid)

//post /api/v1/productos ->dar de alta un nuevo producto
app.post('/api/v1/productos', cargarProducto)

//put /api/v1/productos/:id
app.put('/api/v1/productos/:id', modificarProducto)

//delete /api/v1/productos/:id
app.delete('/api/v1/productos/:id', eliminarProducto)



app.listen(PUERTO)