"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var monitorsController_1 = __importDefault(require("../controllers/monitorsController"));
var eventsController_1 = __importDefault(require("../controllers/eventsController"));
var router = express_1.default.Router();
router.get('/', monitorsController_1.default.findAllMonitors, eventsController_1.default.refreshEventLog, eventsController_1.default.getEventsPages, function (req, res) {
    res.status(200).json(res.locals.events);
});
router.get('/:instanceId', monitorsController_1.default.findSingleMonitor, eventsController_1.default.refreshEventLog, eventsController_1.default.getEventsPages, function (req, res) {
    res.status(200).json(res.locals.events);
});
router.get('/:instanceId/:dbIndex', monitorsController_1.default.findSingleMonitor, eventsController_1.default.refreshEventLog, eventsController_1.default.getEventsPages, function (req, res) {
    res.status(200).json(res.locals.events);
});
exports.default = router;
