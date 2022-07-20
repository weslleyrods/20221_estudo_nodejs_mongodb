//Chamada do express
const express = require('express');
const mongoose = require('mongoose'); 
//chamada das rotas somente do usuário
const mustache = require('mustache-express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const flash = require('express-flash') 

const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy;

const router = require('./routes/index');
const helpers = require ('./helpers')
const app = express();
const errorHandler = require('./handlers/errorHandler');

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.use(express.static(__dirname+'/public'))

app.use(cookieParser(process.env.SECRET));
app.use(session({
    secret: process.env.SECRET,
    resave: false, //se a sessão nao for alterada, diz para a sessão que não precisa ser destruida e recriada a cada req
    saveUninitialized: false, //não salva a sessão se não houver dados para serem salvos
}));
app.use(flash());

app.use((req, res, next)=>{
    res.locals.h = helpers;
    res.locals.flashes = req.flash();
    //res.locals.user = req.user;
    next();
});

app.use(passport.initialize());
app.use(passport.session());
const User = require('./models/User');

//configurações relacionadas ao passport 
passport.use(new LocalStrategy(User.authenticate())); 
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Configurações
app.use('/', router);

app.use(errorHandler.notFound)

app.engine('mst', mustache(__dirname+'/views/partials', '.mst'));//especifica o motor visual
app.set('view engine', 'mst');
app.set('views', __dirname+'/views'); //configura caminho absoluto da pasta views

module.exports = app 