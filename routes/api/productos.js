const router = require('express').Router();
const { Productos } = require('../../conexion')
const middlewares = require('../../middlewares/checkToken')

/**
 * @swagger
 * tags:
 *  name: Productos
 *  description: Operaciones de Productos.
*/

/**
 * @swagger
 * path:
 *  /usuarios/:
 *      get:
 *         summary: Mostrar todos los Productos.
 *         description: Utilizado para mostrar todos los productos registrados.
 *         tags: [Productos]
 *         responses:
 *           '200':
 *             description: Respuesta Exitosa 
*/

// METODO GET: Mostrar Productos (http://localhost:3000/v1/api/productos)
router.get('/', middlewares.isAdmin, async (request, response) => {
    // select * from productos
    const productos = await Productos.findAll();
    response.send(productos);
})

// METODO POST: Crear Nuevo Producto (http://localhost:3000/v1/api/productos)
router.post('/', middlewares.isAdmin, async (request, response) => {
    const producto = await Productos.create(request.body);
    response.json(producto)
})

// METODO DELETE: Borrar Un Producto (http://localhost:3000/v1/api/productos/:id)
router.delete('/:id', middlewares.isAdmin, async (request, response) => {
    await Productos.destroy({
        where: { id: request.params.id}
    })
    response.json({ success: "Producto eliminado."})
})

// METODO PUT: Actualizar Un Producto (http://localhost:3000/productos/:id)
router.put('/:id', middlewares.isAdmin, async (request, response) => {
    await Productos.update(request.body, {
        where: { id: request.params.id }
    });
    response.json({ success: "Producto actualizado."})
})

/**
 * {
 *      code: 200 
 *      message: Mensaje
 *      data: []
 * }
 */

module.exports = router;