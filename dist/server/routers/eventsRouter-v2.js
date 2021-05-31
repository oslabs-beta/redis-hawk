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
router.get('/totals/:instanceId/:dbIndex', monitorsController_1.default.findSingleMonitor, eventsController_1.default.validateRequestType, function (req, res, next) {
    if (req.query.timeInterval)
        eventsController_1.default.getEventsByTimeInterval(req, res, next);
    else if (req.query.eventTotal)
        eventsController_1.default.getSingleEventsTotal(req, res, next);
}, function (req, res) {
    res.status(200).json(res.locals.eventTotals);
});
exports.default = router;
