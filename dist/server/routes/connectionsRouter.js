"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var connectionsController_1 = __importDefault(require("../controllers/connectionsController"));
var router = express_1.default.Router();
router.get('/', connectionsController_1.default.getAllConnections, function (req, res, next) {
    res.status(200).json(res.locals.connections);
});
exports.default = router;
