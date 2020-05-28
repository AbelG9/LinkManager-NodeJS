const express = require('express');
const router = express.Router();

router.get('/', (req, respuesta) => {
    respuesta.send('Hola mundo');
});

module.exports = router;