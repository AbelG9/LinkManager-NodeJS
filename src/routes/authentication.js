//Importación de módulos
const express = require('express');
const router = express.Router();
const passport = require('passport');
//Imprtación de validación de logueo
const { isLoggedIn, isNotLoggedIn } = require('../lib/auth');
//Redirección a página de registro si no se encuentra logueado
router.get('/signup', isNotLoggedIn, (req, res) => {
    res.render('auth/signup');
});
//Validación de registro y redirección a la página de perfil
router.post('/signup', isNotLoggedIn, passport.authenticate('local.signup', {
    successRedirect: '/profile',
    failureRedirect: '/signup',
    failureFlash: true,
}));
//Redirección a la página de ingreso de sistema
router.get('/signin', isNotLoggedIn, (req, res) => {
    res.render('auth/signin');
});
//Validación de datos de usuario y redirección a la página de perfil
router.post('/signin', isNotLoggedIn, (req, res, next) => {
    passport.authenticate('local.signin', {
        successRedirect: '/profile',
        failureRedirect: '/signin',
        failureFlash: true
    }) (req, res, next);
});
//Redirección a la página de perfil
router.get('/profile', isLoggedIn, (req, res) => {
    res.render('profile');
});
//Redirección a página de ingreso si no se encuentra logueado
router.get('/logout', isLoggedIn, (req, res) => {
    req.logOut();
    res.redirect('/signin');
});

module.exports = router;