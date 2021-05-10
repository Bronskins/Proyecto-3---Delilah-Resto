// ---- CONFIGURACION INICIAL ----

const express = require('express'); // Servidor Express
const app = express();
const PORT_SERVER = 3000; // Puerto a traves el cual el servidor va a estar escuchando.
const apiRouter = require("./routes/api")
require('./conexion') // Conexion de la base de datos.

// Middleware: Express JSON Para leer los request body.

app.use(express.json());

// Middleware: Express URL Encoded

app.use(express.urlencoded({ extended: true }))

// Middleware: Configuracion Swagger

const swaggerUi = require('swagger-ui-express') // Libreria Swagger UI Express para armar la documentacion Swagger:

const { swaggerOptions } = require('./swaggerOptions');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerDocument = swaggerJsDoc(swaggerOptions)

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument) )


// Middlware: Ruta base de los endpoints del API.

app.use('/api/v1', apiRouter);



// LISTENER: Seteando el puerto donde el servidor va a estar escuchando.

app.listen(PORT_SERVER, () => {
    console.log(`Servidor iniciado en el puerto ${PORT_SERVER}`)
})

// Metodo GET: De Prueba

app.get('/', (request, response) => {
    response.send("Hello world!")
})