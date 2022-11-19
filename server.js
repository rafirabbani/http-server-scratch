const net = require('net');
const server = net.createServer();
const handler = require('./handler');


const handleConnection = (socket) => {
    try {
        socket.on('data', (data) => {
            handler.requestHandler(data, socket);
        });
        
        server.close(() => {
            console.log('server close gracefully')
        });
    }
    catch (err) {
        console.log('error handle connection', err);
        server.close();
    }
    
};

server.on('connection', (socket) => {
    console.log('client connected');
    handleConnection(socket);
});


server.listen({
    host: 'localhost',
    port: 6060
}, () => {
    console.log('server listening on localhost:6060');
});


