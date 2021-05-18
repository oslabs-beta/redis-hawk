"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var path = require('path');
var app = express();
var monitors = require('./redis-monitors/redis-monitors');
var connectionsRouter = require('./routes/connectionsRouter');
var PORT = +process.env.PORT || 3000;
app.use('/api/connections', connectionsRouter);
app.get('/api/events', function (req, res) {
    var eventLog = monitors[0].keyspaces[0].eventLog;
    var log = [];
    var currentNode = eventLog.head;
    while (currentNode) {
        log.push({
            key: currentNode.key,
            event: currentNode.event,
            timestamp: currentNode.timestamp
        });
        currentNode = currentNode.next;
    }
    res.status(200).json(log);
});
app.get('/', function (req, res) {
    res.status(200).sendFile(path.resolve(__dirname, './assets/index.html'));
});
app.use(function (err, req, res, next) {
    var defaultErr = {
        log: 'Unknown Express middleware occured',
        status: 500,
        message: { error: 'Oops, something went wrong!' }
    };
    err = Object.assign(defaultErr, err);
    console.log(defaultErr.log);
    res.status(defaultErr.status).json(defaultErr.message);
});
app.listen(PORT, function () {
    console.log("Listening on port " + PORT);
});
exports.default = app;
