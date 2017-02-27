var monk = require('monk'); // pomocnik dla MongoDB
var nodemailer = require('nodemailer'); //wysyłanie wiadomości email
var smtpTransport = require('nodemailer-smtp-transport');
var MQTT_client = require('../sockets_server/mqtt');

// Ustaw wewnętrzną zmienną DB
var db = monk('localhost:27017/database');
// Ustaw kolekcję
var devicesCollection = db.get('devicescollection');
var roomsCollection = db.get('roomscollection');
var scenarioCollection = db.get('scenariocollection');
var users = db.get('users');

var email;
var scenarios;
var prev_alm = 'false';

/**
 *
 *  OBSŁUGA WYSYŁANIA WIADOMOŚCI EMAIL
 */
    // create reusable transporter object using the default SMTP transport
var transporter = nodemailer.createTransport(smtpTransport({
        service: 'Gmail',
        auth: {
            user: 'mojdomek12345',
            pass: 'system123'
        }
}));

// znajdź docelowy adres email
users.findOne({},function (err,docs) {
   email = docs.email;
}).then(function (){
    function listen() {
        scenarioCollection.find({}, function (err, docs) {
            if (err) {
                console.log('Wystąpił problem z uzyskaniem informacji z bazy danych.');
            }
            else {
                scenarios = docs;
                //console.log(scenarios);
            }

        }).then(function () {
            scenarios.forEach(function (element, index, array) {
                if (element.data == 'true') {
                    if (element.scenarioName === 'Poza domem') {
                        setAlarm();        // alarm uzbrojony
                        setSwitchesOff();  //wyłącza wszystkie przekaźniki
                    }
                    if (element.scenarioName === 'Wieczór') {
                        setSwitchesOn();//włącza wszystkie przekaźniki
                    }
                    if (element.scenarioName === 'Alarm') {
                        setAlarm();     // alarm uzbrojony
                    }

                }
            });
        });
        setTimeout(listen, 2000);
    }
    listen();
});



/**
 * Obsługa alarmu
 */
function setAlarm() {
    /**
     *
     *  OBSŁUGA WYSYŁANIA WIADOMOŚCI EMAIL
     */
        // create reusable transporter object using the default SMTP transport
    var transporter = nodemailer.createTransport(smtpTransport({
            service: 'Gmail',
            auth: {
                user: 'mojdomek12345',
                pass: 'system123'
            }
        }));

// znajdź docelowy adres email
    users.findOne({},function (err,docs) {
        email = docs.email;
    }).then(function () {
        devicesCollection.find({deviceType: "Alarm"}, function (err, docs) {
            if (err) {
                console.log('Wystąpił problem z uzyskaniem informacji z bazy danych.');
            }
            else {
                var alarms = docs; // pobierz wszystkie urządzenia typu alarm
                alarms.forEach(function (element, index, array) {
                    if ((element.data === 'true' || element.data === true) && prev_alm === 'false') {  //gdy wykryto alarm
                        console.log("Wykryto alarm!")
                        // setup e-mail data with unicode symbols
                        var mailAlarm = {
                            from: '"System Automatyki Budynku" <mojdomek12345@gmail.com>', // sender address
                            to: email, // list of receivers
                            subject: 'ALARM! - DOM ✔', // Subject line
                            text: element.deviceName + ' wykrył alarm.', // plaintext body
                            html: '<b>' + element.deviceName + ' wykrył alarm.</b>'  // html body
                        };
                        // send mail with defined transport object
                        transporter.sendMail(mailAlarm, function (error, info) {
                            if (error) {
                                return console.log(error);
                            }
                            console.log('e-mail sent: ' + info.response);
                        });
                        prev_alm = 'true';
                        console.log(prev_alm);
                        setTimeout(function () {
                            prev_alm = 'false';
                        }, 60000); //odstep 1min
                    }
                });
            }
        });
    });
}

/**
 * switches OFF
 */
function setSwitchesOff() {
    devicesCollection.find({deviceType: "Przełącznik"}, function (err, docs) {
        if (err) {
            console.log('Wystąpił problem z uzyskaniem informacji z bazy danych.');
        }
        else {
            var switches = docs; // pobierz wszystkie urządzenia typu przelacznik
            switches.forEach(function (element, index, array) {
                if (element.data === 'true' || element.data === true) {  //gdy jakiś przełącznik załączony
                    devicesCollection.update({deviceType: "Przełącznik"}, {$set: {"data": "false"}}, function (err, documents) {
                        if (err) {
                            console.log('Wystąpił problem ze zmianą informacji w bazie danych.');
                        }
                        else {
                            var roomID = element.roomID;
                            roomsCollection.findOne({'_id': roomID}, {}, function (err, doc) {
                                if (err) {
                                    console.log('Wystąpił problem z pobraniem informacji z bazy danych.');
                                }
                                else {
                                    var level = doc.levelName;
                                    var room = doc.roomName;
                                    console.log(level);
                                    MQTT_client.mqtt_publish(level, room, element.deviceName, 'false');
                                }
                            });
                        }
                    });
                }

            });
        }
    });
}

/**
 * switches OFF
 */
function setSwitchesOn() {
    devicesCollection.find({deviceType: "Przełącznik"}, function (err, docs) {
        if (err) {
            console.log('Wystąpił problem z uzyskaniem informacji z bazy danych.');
        }
        else {
            var switches = docs; // pobierz wszystkie urządzenia typu przelacznik
            switches.forEach(function (element, index, array) {
                if (element.data === 'false' || element.data === false) {  //gdy jakiś przełącznik wyłączony
                    devicesCollection.update({deviceType: "Przełącznik"}, {$set: {"data": "true"}}, function (err, documents) {
                        if (err) {
                            console.log('Wystąpił problem ze zmianą informacji w bazie danych.');
                        }
                        else {
                            var roomID = element.roomID;
                            roomsCollection.findOne({'_id': roomID}, {}, function (err, doc) {
                                if (err) {
                                    console.log('Wystąpił problem z pobraniem informacji z bazy danych.');
                                }
                                else {
                                    var level = doc.levelName;
                                    var room = doc.roomName;
                                    console.log(level);
                                    MQTT_client.mqtt_publish(level, room, element.deviceName, 'true');
                                }
                            });
                        }
                    });
                }

            });
        }
    });
}