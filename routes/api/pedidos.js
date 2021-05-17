const router = require('express').Router();
const { Pedidos, User, Productos, Detalle } = require('../../conexion')
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

    let userToken = request.headers['user-token']
    
    let payload = {};

    payload = await jwt.decode(userToken, {complete: true});
    
    let user = await User.findOne({
        where: {usuario: payload.payload.usuario},
        
    })
    
    if (user.roles == "admin") {
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
                    attributes: { exclude: ["createdAt", "updatedAt", "id_productos"] },
                    through: {
                        model: Detalle,
                        attributes: { exclude: ["createdAt", "updatedAt", "id_pedidos", "id_productos", "num_detalle"] }
                    }
                }
            ]
        }
        );
        response.send(productos)
    } else {
        const products = await Pedidos.findAll({
            where: { id_usuarios: user.id_usuarios},
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
            
        })

        response.send(products)
    }

 
})

// METODO POST: Crear Nuevo Pedido (http://localhost:3000/v1/api/pedidos)
router.post('/', [
    check('tipoDePago', "El tipo de pago es obligatorio.").not().isEmpty(),
    check("id_productos", "El array de productos es obligatorio.").not().isEmpty()
], checkToken, async (request, response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        return response.status(400).json({ errores: errors.array() });
    }
    
    let productos = request.body.id_productos
    let total = 0
   

    for(let i=0; i < productos.length; i++){
        let resultado = await Productos.findOne({
            where: { id_productos: productos[i] }
        })
        if (!resultado) {
            return response.status(400).json({ error: `No existe producto con el ID ${productos[i]} `})
        } else {
            total = total + resultado.precio
        }
    }
    
    // PRECIO TOTAL

    let precioTotal = total

    // ID USUARIO

    let userToken = request.headers['user-token']
    let payload = await jwt.decode(userToken, {complete: true});
    let user = await User.findOne({
        where: {usuario: payload.payload.usuario}
    })

    let usuarioId = user.id_usuarios

    let resBody = {
        tipoDePago: request.body.tipoDePago,
        estado: "En preparacion",
        id_usuarios: usuarioId,
        pago: precioTotal
    }

    // CREACION PEDIDO

    const pedido = await Pedidos.create(resBody);

    // DETALLE

    let aux = 1

    for(i=0;i < productos.length; i++){

        let busqueda = await Detalle.findOne({
            where: { id_productos: productos[i], id_pedidos: pedido.id_pedidos }
        })

        let busquedaProducto = await Productos.findOne({
            where: { id_productos: productos[i] }
        })

        if(!busqueda){
            if (!busquedaProducto) {
                response.status(400).json({ error: `El producto con el ID ${element} no existe`})
            } else {
                let creacion = await Detalle.create({
                    num_detalle: aux,
                    id_pedidos: pedido.id_pedidos,
                    id_productos: productos[i],
                    cantidad: 1,
                    precio: busquedaProducto.precio
                 })
            }
        } else {

            let leBody = {
                cantidad: busqueda.cantidad + 1,
                precio: busqueda.precio + busquedaProducto.precio
            }
            let actualizacion = await Detalle.update(leBody, {
                where: { id_pedidos: pedido.id_pedidos, id_productos: productos[i] }
            });
        }
        aux++;
    }
 
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