//Importación de módulos
const bcrypt = require('bcryptjs');
const helpers = {};
//Creación de helper de encriptación
helpers.encryptPassword = async (password) => {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    return hash;
};
//Comprobación de contraseña
helpers.matchPassword = async (password, savedPassword) => {
    try {
        return await bcrypt.compare(password, savedPassword);
        
    } catch(e) {
        console.log(e);
    }
};

module.exports = helpers;