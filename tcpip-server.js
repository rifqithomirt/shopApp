var net = require('net');
var HOST = '0.0.0.0';
var PORT = 5055;
var WebSocketServer = require('ws').Server;
var SERVER_PORT = 8081;               // port number for the webSocket server
var wss = new WebSocketServer({port: SERVER_PORT}); // the webSocket server
var connections = new Array;          // list of connections to the server
var wsClient;
// Create a server instance, and chain the listen function to it
// The function passed to net.createServer() becomes the event handler for the 'connection' event
// The sock object the callback function receives UNIQUE for each connection
net.createServer(function(sock) {
    // We have a connection - a socket object is assigned to the connection automatically
    console.log('CONNECTED: ' + sock.remoteAddress +':'+ sock.remotePort);
    // Add a 'data' event handler to this instance of socket
     // when a client sends a message,
    sock.on('data', function(data) { 
        console.log('DATA ' + sock.remoteAddress + ': ' + data);
        if(wsClient){
          wsClient.send(JSON.stringify(data));
        }
           // Write the data back to the socket, the client will receive it as data from the server
    });
    // Add a 'close' event handler to this instance of socket
    sock.on('close', function(data) {
        console.log('CLOSED: ' + sock.remoteAddress +' '+ sock.remotePort);
    });
}).listen(PORT, HOST);
console.log('Server listening on ' + HOST +':'+ PORT);
wss.on('connection', handleConnection);
function handleConnection(client) {
    console.log("tes");
    connections.push(client); // add this client to the connections array  
    client.on('message', function(data){
        console.log(data);
    });
    client.on('close', function() { // when a client closes its connection         console.log("connection closed"); // print it out
        wsClient = false;
        var position = connections.indexOf(client); // get the client's position in the array
        connections.splice(position, 1); // and delete it from the array
    });
    wsClient = client;
} 
    