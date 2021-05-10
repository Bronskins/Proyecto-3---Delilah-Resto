const router = require('express').Router();
const { User, Pedidos } = require('../../conexion')
const bcrypt = require('bcryptjs');
const { check, validationResult } = require('express-validator');
const { checkToken, isAdmin } = require('../../middlewares/checkToken')

/**
 * @swagger
 * tags:
 *  name: Usuarios
 *  description: Operaciones de Usuarios
*/

/**
 * @swagger
 *  /usuarios/:
 *      get:
 *         summary: Mostrar todos los usuarios
 *         description: Utilizado para mostrar todos los usuarios registrados
 *         tags: [Usuarios]
 *         responses:
 *           '200':
 *             description: Respuesta exitosa 
 *         parameters:
 *         - name: id
 *           in: query
 *           description: ID del usuario.
 *           require: true
 *           
 *         
*/

// METODO GET: Mostrar Usuarios (http://localhost:3000/v1/api/usuarios)
router.get('/', checkToken, async (request, response) => {
    // select * from usuarios
    const users = await User.findAll({ 
         include: [
            {
                model: Pedidos,
                as: "Pedidos"
            }
        ] 
    })
    response.send(users);
})

// METODO POST: Crear Nuevo Usuario (http://localhost:3000/v1/api/usuarios)
router.post('/', [
    check("usuario", "El usuario es obligatorio").not().isEmpty(),
    check("contraseña", "El password es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    check("nombreCompleto", "El nombre completo es obligatorio").not().isEmpty(),
    check("direccion", "La direccion es obligatoria.").not().isEmpty()
], async (request, response) => { 

    const errors = validationResult(request);

    if (!errors.isEmpty()) {
        return response.status(404).json({ errores: errors.array() });
    }
    request.body.contraseña = bcrypt.hashSync(request.body.contraseña, 10);

    let userBody = {
        usuario: request.body.usuario,
        nombreCompleto: request.body.nombreCompleto,
        direccion: request.body.direccion,
        contraseña: request.body.contraseña,
        email: request.body.email,
        roles: "user"
    }
    const user = await User.create(userBody);
    response.json(user);
})

// METODO DELETE: Borrar Un Usuario (http://localhost:3000/v1/api/usuarios/:id)
router.delete('/:id', checkToken, isAdmin, async (request, response) => {
    await User.destroy({
        where: { id_usuarios: request.params.id}
    })
    response.json({ success: "Usuario eliminado."})
})

// METODO PUT: Actualizar Un Usuario (http://localhost:3000/usuarios/:id)
router.put('/:id', checkToken, isAdmin, async (request, response) => {
    await User.update(request.body, {
        where: { id_usuarios: request.params.id }
    });
    response.json({ success: "Usuario actualizado."})
})

/**
 * {
 *      code: 200 
 *      message: Mensaje
 *      data: []
 * }
 */

module.exports = router;