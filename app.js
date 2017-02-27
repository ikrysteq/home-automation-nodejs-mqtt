var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ex_session = require('express-session');
var http = require('http');
var monk = require('monk'); // pomocnik dla MongoDB
var mqtt = require('mqtt');
var sysinfo = require('systeminformation');


/**
 * Create MongoDB client
 */
var db = monk('localhost:27017/database');
// domyslne wartosci dla urzadzen alarmowych
var devicesCollection = db.get('devicescollection');
devicesCollection.update({deviceType: 'Alarm'}, {
    $set: {
        "data": "false"
    }
}, function (err, doc) {
    if (err) {
        console.log('Wystąpił problem ze zmianą informacji w bazie danych.');
    }
    else {
        //console.log(doc);
    }
});



// *** TRASY ***
// /routes/plik.js
var mongoDB = require('./public/database/db');
var index = require('./routes/index');
var login = require('./routes/login');
var logout = require('./routes/logout');
var home = require('./routes/home');
var devices = require('./routes/home/devices');
var scenes = require('./routes/home/scenes');
var profile = require('./routes/settings/profile');
var notifications = require('./routes/settings/notifications');
var devices_config = require('./routes/settings/devices_config');
var rooms_config = require('./routes/settings/rooms_config');
var add_device = require('./routes/settings/add_device');
var network = require('./routes/settings/network');
var mqtt_settings = require('./routes/settings/mqtt');
var systeminfo = require('./routes/settings/sysinfo');



//Express
var app = express();

// express-session
var session = {
    secret: 'nasz_maly_sekret',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
    logged_in: false,      //czy zalogowany
    login_incorrect: false //logowanie sie nie powiodło
}

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.set('view options',{layout: true});

// express-session
app.use(ex_session(session));

app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev')); //logger do terminala
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser()); //cookieParser('sekretny_klucz')
app.use(express.static(path.join(__dirname, 'public')));


// Baza danych dostępna dla zapytań do routera Express
app.use(function(req,res,next){
    req.db = db;
    next();
});


//zabezpieczenie dla niezalogowanych
//przekierowanie niezalogowanego użytkownika
app.use(function (req,res,next) {
    if('/login'!= req.url && !req.session.logged_in) {
        return res.redirect('/login');
    } else {
        next();
    }
});


// URL Trasy
app.use('/', index);
app.use('/login', login);
app.use('/logout', logout);
app.use('/home', home);
app.use('/home/devices', devices);
app.use('/home/scenes', scenes);
app.use('/settings/profile', profile);
app.use('/settings/notifications', notifications);
app.use('/settings/devices_config', devices_config);
app.use('/settings/add_device', add_device);
app.use('/settings/rooms_config', rooms_config);
app.use('/settings/network', network);
app.use('/settings/mqtt', mqtt_settings);
app.use('/settings/sysinfo', systeminfo);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});


module.exports = app;
