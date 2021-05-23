"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var keyspacesController_1 = __importDefault(require("../controllers/keyspacesController"));
var router = express_1.Router();
router.get('/', keyspacesController_1.default.getAllInstancesKeyspaces, function (req, res) {
    res.status(200).json({ data: res.locals.data });
});
router.get('/:instanceId', keyspacesController_1.default.getAllKeyspacesForInstance, function (req, res) {
    res.status(200).json({ data: res.locals.data });
});
router.get('/:instanceId/:dbIndex', keyspacesController_1.default.getKeyspaceForInstance, function (req, res) {
    res.status(200).json({ data: res.locals.data });
});
exports.default = router;
