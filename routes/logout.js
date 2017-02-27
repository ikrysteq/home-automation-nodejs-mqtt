/**
 * Created by ikrysteq on 04.01.2017.
 */
var express = require('express');
var router = express.Router();

/* GET  */
router.get('/', function(req, res, next) {
    if ('/' == req.url && 'GET' == req.method) {
        var db = req.db;
        db.close();
        req.session.logged_in = false;
        req.session.login_incorrect = false;
        return res.redirect('/');
    } else {
        next();
    }
});

module.exports = router;
