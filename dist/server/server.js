"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var path = require('path');
var app = express();
var monitors = require('./redis-monitors/redis-monitors');
var connectionsRouter = require('./routes/connectionsRouter');
var eventsRouter = require('./routes/eventsRouter');
var PORT = +process.env.PORT || 3000;
app.use('/api/connections', connectionsRouter);
app.use('/api/events', eventsRouter);
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
    res.status(defaultErr.status).json(defaultErr.message);
});
app.listen(PORT, function () {
    console.log("Listening on port " + PORT);
});
exports.default = app;
