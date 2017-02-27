// zależności modułów
var express = require('express');
var router = express.Router();

router.param('update', function(req, res, next, event){
    console.log('Event was detected: ', event);
    next();
});

/* GET users listing. */
router.get('/', function(req, res, next) {
    if (req.session.logged_in) //gdy zalogowany
    {
        // Pobierz dane MQTT
        // Ustaw wewnętrzną zmienną DB
        var db = req.db;
        var host;
        var port;
        var qos;
        var keepalive;
        var clientid;
        mqttDB = db.get('mqttcollection');
        mqttDB.findOne({protocol: 'mqtt'}, {}, function (err, documents) {
            host = documents.host;
            port = documents.port;
            qos = documents.qos;
            keepalive = documents.keepalive;
            clientid = documents.clientid;
            //console.log('clientid: ' + clientid);
        });
        setTimeout(function(){
            res.render('settings/mqtt', {
                title: 'Ustawienia protokołu MQTT',
                current_url: req.originalUrl,
                username: login,
                host: host,
                port: port,
                qos: qos,
                keepalive: keepalive,
                clientid: clientid
            });
        }, 100);

    } else {
        next();
    }
});



/* POST to Add Device */
router.post('/:update', function(req, res) {
    if('/:update' == req.url && 'POST' == req.method) {
        // Ustaw wewnętrzną zmienną DB
        var db = req.db;

        // Wartości z <form> zależne od atrybutu "name"
        var port = req.body.port;
        var host = req.body.host;
        var qos = req.body.qos;

        // Ustaw kolekcję
        var mqttCollection = db.get('mqttcollection');

        // zapisz do DB
        mqttCollection.update({protocol : 'mqtt'}, {$set:{
            "port": port,
            "host": host,
            "qos": Number(qos),
        }}, function (err, doc) {
            if (err) {
                console.log('UPDATE: Wystąpił problem ze zmianą informacji w bazie danych.');
            }
            else {
                //console.log(deviceName + ' ' + deviceType + ' ' + roomID);
                //var MQTT_client = require('./sockets_server/mqtt');
                //MQTT_client.mqtt_on();    // włącz klienta MQTT: funkcja mqtt_on() w mqtt.js
                // Gdy zapis prawidłowy, przekieruj na obecną stronę
                res.redirect('/settings/mqtt');
            }
        });
    } else {
        next();
    }
});


module.exports = router;
/**
 * Created by ikrysteq on 11.01.2017.
 */
