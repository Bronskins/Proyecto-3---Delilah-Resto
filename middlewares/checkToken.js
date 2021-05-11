const jwt = require('jsonwebtoken');
const moment = require('moment');
const { User } = require('../conexion')

const checkToken = async (request, response, next) => {
    
    let userToken = request.headers['user-token']

    if(!userToken){
        return response.status(400).json(" { error: Falta el token. }")
    }

    let payload = {};

    payload = await jwt.decode(userToken, {complete: true});

    try 
    {
        if(payload.expireAt < moment().unix) {
            return response.json({ error: 'El token ha expirado'});
        } else {
            next();
        }


    } catch (error){
        console.error(error);
        return response.json({ error: "Error al validar usuario"})
    }
}

const isAdmin = async (request, response, next) => {

    let userToken = request.headers['user-token']
    
    let payload = {};

    payload = await jwt.decode(userToken, {complete: true});
    
    let user = await User.findOne({
        where: {usuario: payload.payload.usuario}
    })
    
    if (user.roles != "admin") {
        return response.json( { error: "No tienes permisos suficientes."})
    } else {
        next();
    }
}


module.exports = { checkToken, isAdmin }

