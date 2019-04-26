const http = require('http');
const ws = require('ws');

let server;
let wss;

module.exports = {
    init: (host, port, callback) => {
        server = http.createServer();
        wss = new ws.Server({
            server: server.listen(port, host, () => {
                callback('status', 'started');
            }),
        }, () => {
            callback('status', 'started');
        });
        wss.on('connection', (webSocket, request) => {
            webSocket.on('message', (data) => {
                webSocket.send('okay');
                callback(request.connection.remoteAddress, JSON.parse(data));
            });
            webSocket.on('close', (code, reason) => {
                if (wss.clients.has(webSocket))
                    wss.clients.delete(webSocket);
                callback(request.connection.remoteAddress, { 'status': 'closed' });
            });
            webSocket.on('error', (err) => {
                webSocket.close();
                callback(request.connection.remoteAddress, { 'status': 'error' });
            });
        })
        wss.on('error', (webSocket, err) => {
            wss.close();
            callback('status', 'notStarted');
        });
    },
    stop: (callback) => {
        if (wss)
            wss.close((err) => {
                if (err)
                    if (callback)
                        callback('status', 'stopped');
                if (server)
                    server.close((err) => {
                        if (callback)
                            if (err)
                                callback('status', 'stopped');
                            else
                                callback('status', 'stopped');
                    });
            });
    }
};
