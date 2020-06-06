const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const pool = require('../database');
const helpers = require('../lib/helpers');

passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const rows = await pool.query('SELECT * FROM users WHERE username = ?', [username]);
    console.log(req.body);
    if (rows.length > 0) {
        console.log(rows);
        const user = rows[0];
        console.log('user:' + user.username + 'password: ' + user.password);
        const validPassword = await helpers.matchPassword(password, user.password);
        console.log('valido:' + validPassword);
        if (validPassword) {
            done(null, user, req.flash('success', 'Bienvenid@ ' + user.username));
        } else {
            done(null, false, req.flash('message', 'Contraseña incorrecta'));
        }
    } else {
        return done(null, false, req.flash('message', 'El nombre de usuario no existe'));
    }
}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req, username, password, done) => {
    const { fullname } =req.body;
    const nuevoUsuario = {
        username,
        password,
        fullname
    };
    nuevoUsuario.password = await helpers.encryptPassword(password);
    const result = await pool.query('INSERT INTO users SET ?', [nuevoUsuario]);
    nuevoUsuario.id = result.insertId;
    return done(null, nuevoUsuario);
}));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser( async (id, done) => {
    const filaUsuario = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, filaUsuario[0]);
});