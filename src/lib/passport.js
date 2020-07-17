//Importación de módulos
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
//Creación de conexión a la base de datos
const pool = require('../database');
//Helper de comparación de contraseña
const helpers = require('../lib/helpers');

//Validación de usuario y contraseña
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
        if (validPassword) { //Si los datos son válidos
            done(null, user, req.flash('success', 'Bienvenid@ ' + user.username));
        } else { //Si no son válidos
            done(null, false, req.flash('message', 'Contraseña incorrecta'));
        }
    } else { //Si el usuario no existe
        return done(null, false, req.flash('message', 'El nombre de usuario no existe'));
    }
}));
//Registro de nuevo usuario y encriptación de contraseña
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
//Guardado de la sesión (id del usuario)
passport.serializeUser((user, done) => {
    done(null, user.id);
});
//Obtener los datos de sesión de la base de datos
passport.deserializeUser( async (id, done) => {
    const filaUsuario = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
    done(null, filaUsuario[0]);
});