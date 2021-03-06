const router = require('express').Router();
const { Productos } = require('../../conexion')
const { checkToken, isAdmin } = require('../../middlewares/checkToken')
const { check, validationResult } = require('express-validator');

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
router.get('/', checkToken, async (request, response) => {
    // select * from productos
    const productos = await Productos.findAll();
    response.send(productos);
})

// METODO POST: Crear Nuevo Producto (http://localhost:3000/v1/api/productos)
router.post('/',  [
    check("nombre", "El nombre del producto es obligatorio").not().isEmpty(),
    check("precio", "El precio del producto es obligatorio").not().isEmpty()
], checkToken, isAdmin, async (request, response) => {
    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        return response.status(400).json({ errores: errors.array() });
    }
    
    const producto = await Productos.create(request.body);
    response.json(producto)
})

// METODO DELETE: Borrar Un Producto (http://localhost:3000/v1/api/productos/:id)
router.delete('/:id', checkToken, isAdmin, async (request, response) => {
    await Productos.destroy({
        where: { id_productos: request.params.id}
    })
    response.json({ success: "Producto eliminado."})
})

// METODO PUT: Actualizar Un Producto (http://localhost:3000/productos/:id)
router.put('/:id', checkToken, isAdmin, async (request, response) => {
    await Productos.update(request.body, {
        where: { id_productos: request.params.id }
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