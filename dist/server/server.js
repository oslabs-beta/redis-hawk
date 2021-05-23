"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var path = __importStar(require("path"));
var app = express_1.default();
var connectionsRouter_1 = __importDefault(require("./routes/connectionsRouter"));
var eventsRouter_1 = __importDefault(require("./routes/eventsRouter"));
var keyspacesRouter_1 = __importDefault(require("./routes/keyspacesRouter"));
var PORT = +process.env.PORT || 3000;
app.use('/api/connections', connectionsRouter_1.default);
app.use('/api/events', eventsRouter_1.default);
app.use('/api/keyspaces', keyspacesRouter_1.default);
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
