// zależności modułów
var express = require('express');
var router = express.Router();
//var users = require('../../config/users.json');

// dane użytkownika z DB
var password = "";
var usersDB;

/* GET Profile */
router.get('/', function(req, res, next) {
    if (req.session.logged_in) //gdy zalogowany
    {
        // Pobierz dane użytkownika
        // Ustaw wewnętrzną zmienną DB
        // var db = req.db;
        //
        // usersDB = db.get('users');
        // usersDB.findOne({}, 'username', function (err, documents) {
        //     login = documents.username;
        //     console.log('login: ' + login);
        // });
        // usersDB.findOne({}, 'password', function (err, documents) {
        //     password = documents.password;
        //     console.log('password: ' + password);
        // });
        setTimeout(function(){
            res.render('settings/notifications', { title: 'Profil', current_url: req.originalUrl, username: login });
        }, 100);
    } else {
        next();
    }
});

/* POST email */
router.post('/', function(req, res) {

    // Ustaw wewnętrzną zmienną DB
    var db = req.db;

    // Wartości z <form> zależne od atrybutu "name"
    var userEmail = req.body.user_email;

    // Ustaw kolekcję
    var users = db.get('users');

    // wyszukaj użytkownika
    // usersDB.findOne({}, 'username', function (err, documents) {
    //     login = documents.username;
    //     console.log('llllllogin: ' + login);
    // });
    console.log(login);
    // Wyślij do DB
    users.update({"username" : login}, {$set:{"email": userEmail}}, function (err, doc) {
        if (err) {
            // Gdy zapis się nie powiedzie, zwróć error
            console.log('Wystąpił problem z dodaniem informacji do bazy danych.');
        }
        else {
            // Gdy zapis prawidłowy, przekieruj na obecną stronę
            res.redirect(req.originalUrl);
        }
    });
});
//
//


module.exports = router;
