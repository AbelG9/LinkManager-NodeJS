//Importación de módulos
const express = require('express');
const router = express.Router();
//Redirección a página inicial
router.get('/', (req, res) => {
    res.render('index');
});

module.exports = router;