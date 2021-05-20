"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var keyspacesController = require('../controllers/keyspacesController');
var keyspacesRouter = express_1.Router();
keyspacesRouter.get('/', keyspacesController.getKeyspace, function (req, res) {
    res.status(200).json({ data: res.locals.data });
});
module.exports = keyspacesRouter;
