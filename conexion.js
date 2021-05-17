// Conexion a nuestra base de datos MySQL utilizando Sequelize para la creacion de la base y tablas.

const Sequelize = require('sequelize');
const ProductosModel = require('./models/productos')
const PedidosModel = require('./models/pedidos')
const UserModel = require('./models/usuarios');
const DetalleModel = require('./models/detalle')

// Conexion a la base de datos.

const sequelize = new Sequelize("Proyecto3", "root", "acamica",{
    host: "localhost",
    dialect: "mysql"
});

// Mapeo de la tabla 'Users'

const User = UserModel(sequelize, Sequelize)
const Productos = ProductosModel(sequelize, Sequelize)
const Pedidos = PedidosModel(sequelize, Sequelize)
const Detalle = DetalleModel(sequelize, Sequelize)


User.hasMany(Pedidos, {
    as: "Pedidos",
    foreignKey: "id_usuarios"
})

Pedidos.belongsTo(User, {
    as: "Usuario",
    foreignKey: "id_usuarios"
})

Pedidos.belongsToMany(Productos, {
    through: Detalle,
    as: "Productos",
    foreignKey: "id_pedidos"
})

Productos.belongsToMany(Pedidos, {
    through: Detalle,
    as: "Pedidos",
    foreignKey: "id_productos"
}
)

/* Pedidos.belongsToMany(Productos, { 
    through: ProductoPedido,
    as: 'Productos',  
    foreignKey: "id_pedidos"
});

Productos.belongsToMany(Pedidos, {
    through: ProductoPedido,
    as: 'Pedidos',
    foreignKey: "id_productos"
}) */

/* User.associate = function(models){
    User.hasMany(models.Pedidos),
    {foreignKey: "id_pedidos", as: "pedidos"}
}

Pedidos.associate = function(models){
    Pedidos.belongsToMany(models.User),
    {foreignKey: "id_usuarios", as: "usuarios"}
}  */

/* Pedidos.belongsTo(User) // Nose
User.hasMany(Pedidos) // Bien
 */

// Sincronizacion de las tablas. 

sequelize.sync({ force: false }).then(() => { // Que hace 'force' ?
    console.info('Las tablas fueron sincronizadas correctamente.')
}).catch(console.error)

module.exports = {
    User,
    Productos,
    Pedidos,
    Detalle
}
