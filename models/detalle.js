const moment = require('moment');

module.exports = (sequelize, type) => {
    return sequelize.define('detalle', {
        num_detalle: {
            type: type.INTEGER,
            primaryKey: true
        },
        id_pedidos:{
            type: type.INTEGER,
            primaryKey: true,
            allowNull: false
        },
        id_productos:{
            type: type.INTEGER,
            allowNull: false
        },
        cantidad: {
            type: type.INTEGER,
            allowNull: false
        },
        precio: {
            type: type.INTEGER,
            allowNull: false
        },
        createdAt: {
            type: type.DATE,
            default: moment.unix(),
            allowNull: false
        },
        updatedAt: {
            type: type.DATE,
            default: moment.unix(),
            allowNull: false
        }
    })

};

