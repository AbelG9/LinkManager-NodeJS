//Importación de módulos
const express = require('express');
const router = express.Router();
//Creación de conexión a la base de datos
const pool = require('../database');
//Imprtación de validación de logueo 
const { isLoggedIn } = require('../lib/auth');
//Redirección a página de guardado de enlaces
router.get('/add', isLoggedIn, (req, res) => {
    res.render('links/add');
});
//Guardado de enlaces
router.post('/add', isLoggedIn, async (req, res) => {
    const { title, url, description } = req.body;
    const NuevoEnlace = {
        title,
        url,
        description,
        user_id: req.user.id
    }
    await pool.query('INSERT INTO links set ?',[NuevoEnlace]);
    req.flash('success', 'Enlace guardado satisfactoriamente');
    res.redirect('/links');
});
//Redirección a página de listado de enlaces
router.get('/', isLoggedIn, async (req, res) => {
    const links = await pool.query('SELECT * FROM links WHERE user_id = ?', [req.user.id]);
    res.render('links/list', {links});
});
//Redirección a página de borrado de enlaces
router.get('/delete/:id', isLoggedIn, async (req, res) => {
    const { id } =req.params;
    await pool.query('DELETE FROM links WHERE ID = ?', [id]);
    req.flash('success', 'Enlace eliminado satisfactoriamente');
    res.redirect('/links');
});
//Redirección a página de edición de enlaces
router.get('/edit/:id', isLoggedIn, async (req, res) => {
    const { id }=req.params;
    const datalinks = await pool.query('SELECT * FROM links WHERE ID = ?', [id]);
    res.render('links/edit', {datalink: datalinks[0]});
});
//Modificado de enlaces
router.post('/edit/:id', isLoggedIn, async (req, res) => {
    const { id }=req.params;
    const { title, url, description } = req.body;
    const EditEnlace = {
        title,
        url,
        description
    };
    await pool.query('UPDATE links set ? WHERE id = ?', [EditEnlace, id]);
    req.flash('success', 'Enlace actualizado satisfactoriamente');
    res.redirect('/links');
});

module.exports = router;