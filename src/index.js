//importación de módulos instalados
const express = require('express');
const morgan = require('morgan');
const exp_handlebars = require('express-handlebars');
const path = require('path');
const flash = require('connect-flash');
const session = require('express-session');
const MySqlStore = require('express-mysql-session');
const passport = require('passport');

//importación de la base de datos
const { database } = require('./keys');

//inicializaciones
const app = express();
require('./lib/passport');

//configuracion de puerto de operación
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
//creación de handlebars (plantillas)
app.engine('.hbs',exp_handlebars({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layouts'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.hbs',
    helpers: require('./lib/timehandlebars'),
}) );
app.set('view engine', 'hbs');


//Middlewares
app.use(flash());
//Inicialización de la sesión
app.use(session({
    secret: 'AGmysqlnodesession',
    resave: false,
    saveUninitialized: false,
    store: new MySqlStore(database),
}));
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

//Variables globales
app.use((req, res, next) => {
    app.locals.success = req.flash('success');
    app.locals.message = req.flash('message');
    app.locals.user = req.user;
    next();
});

//Rutas
app.use(require('./routes/index'));
app.use(require('./routes/authentication'));
app.use('/links',require('./routes/links'));

//Archivos públicos
app.use(express.static(path.join(__dirname,'public')));

//Iniciando el server
app.listen(app.get('port'), () => {
    console.log('Servidor funcionando en el puerto', app.get('port'));
});