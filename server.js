const net = require('net');
const handler = require('./handler');
const server = net.createServer();


const handleConnection = (socket) => {
    socket.on('data', (data) => {
        handler.requestHandler(data, socket);
    });
    

    socket.on('error', (err) => {
        console.log(err);
    })

    server.close(() => {
        console.log('server close gracefully')
    });
    
};

server.on('connection', (socket) => {
    try {
        console.log('client connected');
        handleConnection(socket);
    }
    catch {
        console.log(err)
    }
    
});


server.listen({
    host: 'localhost',
    port: 6060
}, () => {
    console.log('server listening on localhost:6060');
});


