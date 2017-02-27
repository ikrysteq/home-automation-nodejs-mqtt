
/**
 * Socket.io client
 */
var socket = io.connect();
socket.on('sysinfo', function (data) {
    $("#sysTime").text(Date(data.sysTime));
    $("#cpuLoad").text(data.currentload);
    $("#device_manufacturer").text(data.device);
    $("#OSinfo").text(data.OS);
    $("#hostname").text(data.hostname);

    $("#interface").text(data.interface_name);
    $("#type_con").text(data.conntype);
    $("#IP").text(data.ip_address);
    $("#MAC").text(data.mac_address);
    $("#gateway").text(data.gateway_ip);
    $("#netmask").text(data.netmask);

});

