// De aca utilizamos el router para manejar los endpoints de nuestro servidor.

const router = require("express").Router(); // Usamos el router de Express
const apiUsersRoute = require('./api/usuarios')
const apiProductsRoute = require('./api/productos')
const apiLoginRoute = require('./api/login');
const apiPedidosRoute = require('./api/pedidos')

// http://localhost:3000/api/v1/usuarios

router.use('/usuarios', apiUsersRoute);

// http://localhost:3000/api/v1/productos

router.use('/productos', apiProductsRoute);

// http://localhost:3000/api/v1/login

router.use('/login', apiLoginRoute);

// http://localhost:300/api/v1/pedidos

router.use('/pedidos', apiPedidosRoute);

module.exports = router;