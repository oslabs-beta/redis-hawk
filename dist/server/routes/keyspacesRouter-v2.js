"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var keyspacesController_1 = __importDefault(require("../controllers/keyspacesController"));
var router = express_1.default.Router();
router.get('/', keyspacesController_1.default.findAllMonitors, keyspacesController_1.default.refreshKeyspace, keyspacesController_1.default.getKeyspacePages, function (req, res) {
    res.status(200).json(res.locals.keyspaces);
});
router.get('/:instanceId', keyspacesController_1.default.findSingleMonitor, keyspacesController_1.default.refreshKeyspace, keyspacesController_1.default.getKeyspacePages, function (req, res) {
    res.status(200).json(res.locals.keyspaces);
});
router.get('/:instanceId/:dbIndex', keyspacesController_1.default.findSingleMonitor, keyspacesController_1.default.refreshKeyspace, keyspacesController_1.default.getKeyspacePages, function (req, res) {
    res.status(200).json(res.locals.keyspaces);
});
exports.default = router;
