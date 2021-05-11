const router = require('express').Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const { check, validationResult } = require('express-validator');
const { User } = require('../../conexion')

router.post('/', [
    check("usuario", "El usuario es obligatorio").not().isEmpty(),
    check("contraseña", "El password es obligatorio").not().isEmpty()
], async (request, response) => { 

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(400).json({ errores: errors.array() });
    }

   let user = await User.findOne({
        where: { usuario: request.body.usuario}
    })
    if(!user){
        response.status(404).json({ errores: "El usuario es incorrecto."})
    } else {
        bcrypt.compare(request.body.contraseña, user.contraseña , function(err, result){
            if(result){
                let token = jwt.sign({
                    usuario: request.body.usuario
                }, request.body.contraseña)
                response.status(200).json(token)
            } else {
                response.status(404).json( { errores: "La contraseña es incorrecta."})
            }
        })
    }
});

module.exports = router;