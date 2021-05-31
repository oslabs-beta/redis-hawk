"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var path_1 = __importDefault(require("path"));
var app = express_1.default();
var connectionsRouter_1 = __importDefault(require("./routers/connectionsRouter"));
var eventsRouter_1 = __importDefault(require("./routers/eventsRouter"));
var eventsRouter_v2_1 = __importDefault(require("./routers/eventsRouter-v2"));
var keyspacesRouter_1 = __importDefault(require("./routers/keyspacesRouter"));
var keyspacesRouter_v2_1 = __importDefault(require("./routers/keyspacesRouter-v2"));
var PORT = +process.env.PORT || 3000;
app.use('/api/connections', connectionsRouter_1.default);
app.use('/api/events', eventsRouter_1.default);
app.use('/api/v2/events', eventsRouter_v2_1.default);
app.use('/api/keyspaces', keyspacesRouter_1.default);
app.use('/api/v2/keyspaces', keyspacesRouter_v2_1.default);
app.get('/', function (req, res) {
    res.status(200).sendFile(path_1.default.resolve(__dirname, "./assets/index.html"));
});
app.use('*', function (req, res) {
    res.sendStatus(404);
});
app.use(function (err, req, res, next) {
    var defaultErr = {
        log: "Unknown Express middleware occured",
        status: 500,
        message: { error: "Oops, something went wrong!" },
    };
    err = Object.assign(defaultErr, err);
    console.log("Server error encountered: " + err.log);
    res.status(defaultErr.status).json(defaultErr.message);
});
exports.default = app.listen(PORT, function () {
    console.log("Listening on port " + PORT);
});
