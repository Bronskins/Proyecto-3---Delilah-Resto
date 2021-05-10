module.exports = (sequelize, type) => {
    return sequelize.define('productos', {
        id_productos: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        nombre: {
            type: type.STRING(255),
            allowNull: false
        },
        precio: {
            type: type.INTEGER,
            allowNull: false
        }
    })

};