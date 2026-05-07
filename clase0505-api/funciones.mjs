import productos from './productos.mjs'

export function obtenerProductos(req,res){
    res.json(productos)
}

export function obtenerProductoporid(req,res){
    const id_producto= Number(req.params.id)
    const productosFiltrados = productos.filter((producto)=>{
        return Number(producto.id) === id_producto
    })
    if(productosFiltrados.length>0){
        const respuesta={
            datos:productosFiltrados,
            url:'http://localhost:3000/api/v1/productos' + id_producto,
            status:404
        }
       res.json(respuesta)
    }else{
        res.status(404).json({
            mensaje:'producto no encontrado'
        })
    }
    }
    
export function eliminarProducto (req, res){
   
    const id_producto= Number(req.params.id)
    //filter
    const productosFiltrados = productos.datos.filter((producto)=>{
        return Number(producto.id) !== id_producto
    })
    //productos=productosFiltrados
    //verificamos si hay elementos en el arreglo
    const respuesta={
         datos:productosFiltrados,
         url:'http://localhost:3000/api/v1/productos' + id_producto,
         status:404,
         verbo:'delete'
        }
       res.json(respuesta)

}
export function cargarProducto(req,res){
    //recibo los datos convertidos a js
    const producto= req.body
    //genero una estructura para el producto a insertar
    const ultimoID=productos.ultimo_id + 1
    const productoFinal={
        id: ultimoID,
        ...producto
       // producto.id=producto.ultimo_id +1
    }
    productos.datos.push(productoFinal)
    productos.ultimo_id=ultimoID
    res.status(201).json({mensaje: 'se dio de alta'})}
    
export function modificarProducto(req,res){
     const id_producto= Number(req.params.id)
     const nuevoProducto= req.body //necesitamos saber el id para sacar los datos del producto a modificar
    productos.datos.map((producto)=>{
        if(Number(producto.id)===id_producto){
            const indice= productos.datos.indexOf(producto)
            console.log(indice)
            productos.datos[indice]={
                id:id_producto, 
                ...nuevoProducto
            }
        }
       
    })
    res.json({mensaje:'se modifico el producto con id'+ id_producto})
}







/* Profe
export function eliminar(req,res){
    const id_producto= Number(req.params.id)
    //filter
    const productosFiltrados = productos.filter((producto)=>{
        return Number(producto.id) !== id_producto
    })
    productos=productosFiltrados
    //verificamos si hay elementos en el arreglo
    const respuesta={
         mensaje:'producto eliminado',
         url:'http://localhost:3000/api/v1/productos' + id_producto,
         status:404,
         verbo:'delete'
        }
       res.json(respuesta)
}

*/


/* yop
const id_producto = Number(req.params.id);
    const indiceProducto = productos.findIndex((producto) => {
        return Number(producto.id) === id_producto;
    });

    if (indiceProducto !== -1) {
        const productoEliminado = productos.splice(indiceProducto, 1);
        res.json({
            mensaje: 'Producto eliminado correctamente',
            datos: productoEliminado[0],
            status: 200
        });
    } else {
        res.status(404).json({
            mensaje: 'Producto no encontrado'
        });
    }


*/
