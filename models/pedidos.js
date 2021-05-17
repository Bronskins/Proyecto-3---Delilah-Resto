const moment = require('moment')

module.exports = (sequelize, type) => {
    return sequelize.define('pedidos', {
        id_pedidos: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        estado: {
            type: type.STRING(255),
            allowNull: false
        },
        createdAt: {
            type: type.DATE,
            default: moment.unix(),
            allowNull: false
        },
        pago:{
            type: type.INTEGER,
            allowNull: false
        },
        tipoDePago:{
            type: type.STRING(255),
            allowNull: false
        }
    });
};