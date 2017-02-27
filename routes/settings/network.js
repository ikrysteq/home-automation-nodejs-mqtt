// zależności modułów
var express = require('express');
var router = express.Router();



/* GET users listing. */
router.get('/', function(req, res, next) {
    if (req.session.logged_in) //gdy zalogowany
    {
        res.render('settings/network', { title: 'Ustawienia sieciowe', current_url: req.originalUrl, username: login });
    } else {
        next();
    }
});


module.exports = router;
