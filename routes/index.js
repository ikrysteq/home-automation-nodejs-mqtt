// zależności modułów
var express = require('express');
var router = express.Router();


/* GET home page. */
// strona logowania
router.get('/', function(req, res, next) {
    // gdy użytkownik jest zalogowany
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
        return res.redirect('/login');
    } else {
        next();
    }
});

module.exports = router;
