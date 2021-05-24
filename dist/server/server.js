"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var app = express_1.default();
var connectionsRouter_1 = __importDefault(require("./routes/connectionsRouter"));
var eventsRouter_1 = __importDefault(require("./routes/eventsRouter"));
var keyspacesRouter_1 = __importDefault(require("./routes/keyspacesRouter"));
var PORT = +process.env.PORT || 3000;
app.use('/api/connections', connectionsRouter_1.default);
app.use('/api/events', eventsRouter_1.default);
app.use('/api/keyspaces', keyspacesRouter_1.default);
app.get('/', function (req, res) {
    res.status(200).sendFile(path_1.default.resolve(__dirname, './assets/index.html'));
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
