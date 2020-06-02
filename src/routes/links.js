const express = require('express');
const router = express.Router();

const pool = require('../database');

router.get('/add', (req, res) => {
    res.render('links/add');
});

router.post('/add', async (req, res) => {
    const { title, url, description } = req.body;
    const NuevoEnlace = {
        title,
        url,
        description
    }
    await pool.query('INSERT INTO links set ?',[NuevoEnlace]);
    req.flash('success', 'Enlace guardado satisfactoriamente');
    res.redirect('/links');
});

router.get('/', async(req, res) => {
    const links = await pool.query('SELECT * FROM links');
    res.render('links/list', {links});
});

router.get('/delete/:id', async (req, res) => {
    const { id } =req.params;
    await pool.query('DELETE FROM links WHERE ID = ?', [id]);
    req.flash('success', 'Enlace eliminado satisfactoriamente');
    res.redirect('/links');
});

router.get('/edit/:id', async (req, res) => {
    const { id }=req.params;
    const datalinks = await pool.query('SELECT * FROM links WHERE ID = ?', [id]);
    res.render('links/edit', {datalink: datalinks[0]});
});

router.post('/edit/:id', async (req, res) => {
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