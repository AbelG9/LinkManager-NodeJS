const express = require('express');
const morgan = require('morgan');
const exp_handlebars = require('express-handlebars');
const path = require('path');

//inicializaciones
const app = express();

//configuraciones
app.set('port', process.env.PORT || 4000);
app.set('views', path.join(__dirname, 'views'));
app.engine('.exp_hbs',exp_handlebars({
    defaultLayout: 'main',
    layoutsDir: path.join(app.get('views'), 'layout'),
    partialsDir: path.join(app.get('views'), 'partials'),
    extname: '.exp_hbs',
    helpers: require('./lib/handlebars'),
}) );
app.set('view engine', 'exp_hbs');


//Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());

//Variables globales
app.use((req, res, next) => {

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