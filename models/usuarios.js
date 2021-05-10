const moment = require('moment');

module.exports = (sequelize, type) => {
    return sequelize.define('usuarios', {
        id_usuarios: {
            type: type.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        usuario: {
            type: type.STRING(255),
            allowNull: false
        },
        email: {
            type: type.STRING(255),
            allowNull: false
        },
        contraseña: {
            type: type.STRING(255),
            allowNull: false
        },
        nombreCompleto: {
            type: type.STRING(255),
            allowNull: false
        },
        direccion: {
            type: type.STRING(255),
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
        },
        roles: {
            type: type.STRING(255),
            allowNull: false
        }
    })

};

