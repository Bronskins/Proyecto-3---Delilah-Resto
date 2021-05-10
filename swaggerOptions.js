const swaggerOptions = {
    swaggerDefinition: {
        info: {
            version: "1.0.0",
            title: "Delilah Resto API",
            description: "Este es el API para realizar operaciones CRUD de Pedidos, Productos y Usuarios.",
            contact:{
                name: "Pablo Correa"
            }
        },
        host: "localhost:3000",
        basePath: "/api/v1",
        servers: ["http://localhost:3000"],
        tags: ["Usuarios"]
    },
    // ['.routes/¨.js']
    apis: ["./routes/api/*", "./models/*"]
};

exports.swaggerOptions = swaggerOptions;