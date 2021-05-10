const moment = require('moment');

module.exports = (sequelize, type) => {
    return sequelize.define('producto_pedido', {
        id_productos: {
            type: type.INTEGER,
            primaryKey: true
        },
        id_pedidos: {
            type: type.INTEGER,
            primaryKey: true
        },
        createdAt: {
            default: moment.unix(),
            type: type.DATE
        },
        updatedAt: {
            default: moment.unix(),
            type: type.DATE
        }
    })
};