const router = require('express').Router();
const { Pedidos, User, Productos, ProductoPedido } = require('../../conexion')
const { checkToken, isAdmin} = require('../../middlewares/checkToken')
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

/**
 * @swagger
 * tags:
 *  name: Pedidos
 *  description: Operaciones de todos los pedidos.
*/

/**
 * @swagger
 * path:
 *  /usuarios/:
 *      get:
 *         summary: Mostrar todos los pedidos.
 *         description: Utilizado para mostrar todos los pedidos
 *         tags: [Pedidos]
 *         responses:
 *           '200':
 *             description: Respuesta exitosa 
*/

// METODO GET: Mostrar Pedidos (http://localhost:3000/v1/api/pedidos)

router.get('/', checkToken , async (request, response) => {
    // select * from productos
    const productos = await Pedidos.findAll({ 
        attributes: { exclude: ["createdAt", "updatedAt", "id_usuarios"] },
        include: [
            {
                model: User,
                as: "Usuario",
                attributes: ["id_usuarios", "nombreCompleto", "direccion", "email"]
            },
            {
                model: Productos,
                as: "Productos",
                attributes: { exclude: ["createdAt", "updatedAt"] },
                through: {
                attributes: []
                }
            }
        ]
    }
    );
    response.send(productos);
})

// METODO POST: Crear Nuevo Pedido (http://localhost:3000/v1/api/pedidos)
router.post('/', [
    check('tipoDePago', "El tipo de pago es obligatorio.").not().isEmpty(),
    check("id_productos", "El array de productos es obligatorio.").not().isEmpty()
], checkToken, async (request, response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        return response.status(404).json({ errores: errors.array() });
    }
    
    let productos = request.body.id_productos
    myArray = new Array
    let total = 0
   

    for(let i=0; i < productos.length; i++){
        let resultado = await Productos.findOne({
            where: { id_productos: productos[i] }
        })
        if (!resultado) {
            console.log("No hay producto con ese ID")
        } else {

            total = total + resultado.precio
        
            if(myArray.includes(`x1 ${resultado.nombre}`)){
                let valor = myArray.indexOf(`x1 ${resultado.nombre}`)
                myArray[valor] = `x2 ${resultado.nombre}`
            } else if (myArray.includes(`x2 ${resultado.nombre}`)){
                let valor = myArray.indexOf(`x2 ${resultado.nombre}`)
                myArray[valor] = `x3 ${resultado.nombre}`
            } else {
                myArray.push(`x1 ${resultado.nombre}`)
            }

        }
    }

   
    // DESCRIPCION
    let descripcion = myArray.toString()
    console.log(descripcion)
    
    // PRECIO TOTAL

    let precioTotal = total
    console.log(precioTotal)

    // ID USUARIO

    let userToken = request.headers['user-token']
    let payload = await jwt.decode(userToken, {complete: true});
    let user = await User.findOne({
        where: {usuario: payload.payload.usuario}
    })

    let usuarioId = user.id_usuarios
    console.log(usuarioId)

    let resBody = {
        tipoDePago: request.body.tipoDePago,
        estado: "En preparacion",
        id_usuarios: usuarioId,
        descripcion: descripcion,
        pago: precioTotal
    }

    // CREACION PEDIDO

    const pedido = await Pedidos.create(resBody);

    
    // CREACION PEDIDO_PRODUCTO

    productos.forEach(async (element) => {
        let producto = await ProductoPedido.create({
            id_pedidos: pedido.id_pedidos,
            id_productos: element
        })
    });


    response.json(pedido)
})

// METODO DELETE: Borrar Un Pedido (http://localhost:3000/v1/api/pedidos/:id)
router.delete('/:id', checkToken, isAdmin, async (request, response) => {
    await Pedidos.destroy({
        where: { id_pedidos: request.params.id}
    })
    response.json({ success: "Pedido eliminado."})
})

// METODO PUT: Actualizar Un Pedido (http://localhost:3000/pedidos/:id)
router.put('/:id', checkToken, isAdmin, async (request, response) => {
    await Pedidos.update(request.body, {
        where: { id_pedidos: request.params.id }
    });
    response.json({ success: "Pedido actualizado."})
})

/**
 * {
 *      code: 200 
 *      message: Mensaje
 *      data: []
 * }
*/

module.exports = router;