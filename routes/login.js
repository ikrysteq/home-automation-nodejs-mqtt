/**
 * Created by ikrysteq on 03.01.2017.
 * jak na razie moduł nie działa
 */
// zależności modułów
var express = require('express');
var router = express.Router();
// var users = require('../config/users.json');

// dane użytkownika z DB
global.login = "";
var password = "";
var usersDB;

/* LOGIN page */
// GET login
router.get('/', function(req, res, next) {

    // Ustaw wewnętrzną zmienną DB
    var db = req.db;

    usersDB = db.get('users');
    usersDB.findOne({}, 'username', function (err, documents) {
        login = documents.username;
        console.log('login: ' + login);
    });
    usersDB.findOne({}, 'password', function (err, documents) {
        password = documents.password;
        console.log('password: ' + password);
    });

    // gdy użytkownik jest zalogowany przekieruj na /home
    if ('/' == req.url && req.session.logged_in == true) {
        console.log('   Login: ' + req.session.logged_in);
        return res.redirect('/home');
    } else {
        next();
    }
}, function (req,res,next) {
    // gdy użytkownik jest niezalogowany
    if ('/' == req.url && 'GET' == req.method) {
        req.session.logged_in = false;
        console.log('   Login: ' + req.session.logged_in);
        //return res.redirect('/login');
        return res.render('login', { title: 'Logowanie', login_incorrect: req.session.login_incorrect });
    } else {
        next();
    }
});

// POST login
router.post('/', function(req,res,next) {


    if('/' == req.url && 'POST' == req.method) {
        setTimeout(function(){  //oczekiwanie na pobranie z
            //if(!users[req.body.user] || req.body.password != users[req.body.user].password) {
            //if( req.body.user_login != users['user'].login || req.body.password != users['user'].password) {
            if( req.body.user_login !== login || req.body.password !== password) {
                req.session.login_incorrect = true;
                //console.log(users[req.body.password]);

                console.log(req.session.logged_in);
                return res.render('login', { title: 'Logowanie', login_incorrect: req.session.login_incorrect });
                // return res.redirect('/login');

            } else {
                req.session.logged_in = true; //zalogowany
                req.session.login_incorrect = false;
                // req.session.name = users['user'].login; // nazwa sesji
                req.session.name = login; // nazwa sesji

                //res.end('Zalogowano pomyślnie! <br>Witaj ' + req.session.name + '! <br> <a href="/home">Wróć</a>');
                //console.log(users['user'].name); //Jan Kowalski

                console.log('Zalogowano pomyślnie! User: ' + req.session.name);
                console.log('   Logged_in: ' + req.session.logged_in);
                return res.redirect('/home');
                // res.end(req.redirect('/home'));
            }
        }, 1);

    } else {
        next();
    }
});


// // POST login
// router.post('/', function(req,res,next) {
//     if('/' == req.url && 'POST' == req.method) {
//         //if(!users[req.body.user] || req.body.password != users[req.body.user].password) {
//         if( req.body.user_login != users['user'].login || req.body.password != users['user'].password) {
//             req.session.login_incorrect = true;
//             console.log(users[req.body.password]);
//
//             console.log(req.session.logged_in);
//             return res.render('login', { title: 'Logowanie', login_incorrect: req.session.login_incorrect });
//             // return res.redirect('/login');
//
//         } else {
//             req.session.logged_in = true; //zalogowany
//             req.session.login_incorrect = false;
//             req.session.name = users['user'].login; // nazwa sesji
//
//             //res.end('Zalogowano pomyślnie! <br>Witaj ' + req.session.name + '! <br> <a href="/home">Wróć</a>');
//             //console.log(users['user'].name); //Jan Kowalski
//
//             console.log('Zalogowano pomyślnie! User: ' + req.session.name);
//             console.log('   Logged_in: ' + req.session.logged_in);
//             return res.redirect('/home');
//             // res.end(req.redirect('/home'));
//
//         }
//     } else {
//         next();
//     }
// });


module.exports = router;
