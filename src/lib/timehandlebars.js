//Importación de módulos
const {format} = require('timeago.js');
const helpers = {};
//Ejecución de módulo de formato de tiempo
helpers.timeago = (timestamp) => {
    return format(timestamp);
};

module.exports = helpers;