var sysinfo = require('systeminformation');
var network = require('network');



var OS;
var device;
var netinfo = {
    interface_name: '-',
    conntype: '-',
    ip_address: '-',
    mac_address: '-',
    gateway_ip: '-',
    netmask: '-'
};


/**
 *  socket.io
 */


module.exports = function (io) {
/**
 *  socket.io
 */

    /**
     *  gdy użytkownik połączony
     */
    io.on('connection', function(socket) {
        console.log(' socket.io connected');
        socket.on('disconnect', function(){
            console.log(' socket.io disconnected');
        });
    });

    /**************************************************
     *  SysInfo socket
     **************************************************/
    io.on('connection', function (socket) {
        //network info
        network.get_active_interface(function(err, net) {
            netinfo = net;
        });
    });

    // update sysinfo loop
    io.on('connection', function (socket) {
        function sysInfoUpdate() {
            // Time : current, uptime
            var systemTime = sysinfo.time().current;
            socket.emit('sysinfo', {sysTime: systemTime});

            // CPU obciążenie
            sysinfo.currentLoad(function (data) {
                try {
                    var load = data.currentload.toString().split(".");
                    var cpu = load[0] + ',' + load[1].slice(0,1) + '%';
                } catch (e) {} //obsługa błędu


                socket.emit('sysinfo', {currentload: cpu});
            });

            // Device info
            sysinfo.system(function(data) {
                device = data.manufacturer + ' ' + data.model + ' v.' + data.version;
                //console.log(device);
                socket.emit('sysinfo', {device: device});
            });

            //OS info
            sysinfo.osInfo(function(data) {
                OS = data.platform + ' ' + data.distro + ' ' + data.release;
                var hostname = data.hostname;
                socket.emit('sysinfo', {OS: OS, hostname: hostname});
                //console.log(hostname);
            });


            setTimeout(sysInfoUpdate, 1000);
        }
        sysInfoUpdate();
        /*******************************************
         * Network update info
         ******************************************/
        // update network loop
        function networkUpdate() {
            //network
            try {
                socket.emit('sysinfo', {
                    interface_name: netinfo.name,
                    conntype: netinfo.type,
                    ip_address: netinfo.ip_address,
                    mac_address: netinfo.mac_address,
                    gateway_ip: netinfo.gateway_ip,
                    netmask: netinfo.netmask
                });
            } catch (e) {
                console.error(e)
            }
            setTimeout(networkUpdate, 5000);
        }
        networkUpdate();

    });


}

