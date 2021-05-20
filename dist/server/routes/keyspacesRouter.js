"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var keyspacesController = require('../controllers/keyspacesController');
var keyspacesRouter = express_1.Router();
keyspacesRouter.get('/', keyspacesController.getAllInstancesKeyspaces, function (req, res) {
    res.status(200).json({ data: res.locals.data });
});
keyspacesRouter.get('/:instanceId', keyspacesController.getAllKeyspacesForInstance, function (req, res) {
    res.status(200).json({ data: res.locals.data });
});
keyspacesRouter.get('/:instanceId/:dbIndex', keyspacesController.getKeyspaceForInstance, function (req, res) {
    res.status(200).json({ data: res.locals.data });
});
module.exports = keyspacesRouter;
