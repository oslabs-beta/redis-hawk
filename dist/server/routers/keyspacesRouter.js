"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var keyspacesController_1 = __importDefault(require("../controllers/keyspacesController"));
var monitorsController_1 = __importDefault(require("../controllers/monitorsController"));
var router = express_1.default.Router();
router.get('/', monitorsController_1.default.findAllMonitors, keyspacesController_1.default.getKeyspacesForInstance, function (req, res) {
    res.status(200).json(res.locals.keyspaces);
});
router.get('/:instanceId', monitorsController_1.default.findSingleMonitor, keyspacesController_1.default.getKeyspacesForInstance, function (req, res) {
    res.status(200).json(res.locals.keyspaces);
});
router.get('/:instanceId/:dbIndex', monitorsController_1.default.findSingleMonitor, keyspacesController_1.default.getKeyspacesForInstance, function (req, res) {
    res.status(200).json(res.locals.keyspaces);
});
exports.default = router;
