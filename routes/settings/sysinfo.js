// zależności modułów
var express = require('express');
var router = express.Router();
var sysinfo = require('systeminformation');



/* GET users listing. */
router.get('/', function(req, res, next) {


    if (req.session.logged_in) //gdy zalogowany
    {

        res.render('settings/sysinfo', { title: 'O systemie',
            current_url: req.originalUrl,
            username: login,
            // sysTime: systemTime
            //network: network
        });
    } else {
        next();
    }
});


module.exports = router;
