// Implement a TCP Server for communication
// Store IP address of the device and attach it to device name
// Store all data in Redis
// Run a small HTTP server for showing current status

const net = require('net');
const redis = require("redis");
const chalk = require("chalk");

const redisClient = redis.createClient();

redisClient.on("error", function (error) {
    console.error(chalk.red("Unable to open redis. Reason: ", error));
});

const port = 7070;
const host = '0.0.0.0';

const server = net.createServer();
server.listen(port, host, () => {
    console.log(chalk.blue("TCP Server running on port " + port + "."));
});

let sockets = [];

function fetchListOfThings(socket) {

    socket.write(`GET /things HTTP/1.1
Host: 127.0.0.1:7070
Content-Type: application/json
Accept: application/json`);

}

server.on('connection', function (sock) {
    console.log('CONNECTED: ' + sock.remoteAddress + ':' + sock.remotePort);
    fetchListOfThings(sock);
    sockets.push(sock);

    sock.on('connect', function (had_error) {
        console.log(chalk.blue(`Got a new connection from ${sock.remoteAddress}:${sock.remotePort}`));

        // Get the list of things attached on the device
        // Create a devices to IP address + Port Map here

    })

    sock.on('data', function (data) {
        console.log(chalk.yellow(`DATA ${sock.remoteAddress}`));

        // Data is a nodeJS Buffer object - https://nodejs.org/api/buffer.html
        console.log(`${data}`);

        // If data is coming in from Qube server,
        //      find the correct socket with correct IP and port
        //      then send them the data, otherwise store it for sending it later

        // Write the data back to all the connected, the client will receive it as data from the server
        sockets.forEach(function (sock, index, array) {
            sock.write(sock.remoteAddress + ':' + sock.remotePort + " said " + data + '\n');
        });
    });

    // Add a 'close' event handler to this instance of socket
    sock.on('close', function (data) {
        let index = sockets.findIndex(function (o) {
            return o.remoteAddress === sock.remoteAddress && o.remotePort === sock.remotePort;
        })
        if (index !== -1) sockets.splice(index, 1);
        console.log(chalk.blue(`CLOSED ${sock.remoteAddress}:${sock.remotePort}`));
    });
});