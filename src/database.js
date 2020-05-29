const mysql = require('mysql');
const {promisify} = require('util');

const { database } = require('./keys');
const pool = mysql.createPool(database);

pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.error('La conexión con la base de datos fue cerrada');
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.error('La base de datos tiene demasiadas conexiones');
        }
        if (err.code === 'ECONNREFUSED') {
            console.error('La conexión con las base de datos ha sido rechazada');
        }
    }
    if (connection) connection.release();
    console.log('La conexión con la base de datos ha sido establecida');
    return;
});

//Promisify pool querys (Promesas en asíncrono)
pool.query = promisify(pool.query);

module.exports = pool;