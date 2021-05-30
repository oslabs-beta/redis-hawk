"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var router = express_1.default.Router();
router.get('/', function (req, res) {
    res.status(200).json(res.locals.events);
});
router.get('/:instanceId', function (req, res) {
    res.status(200).json(res.locals.events);
});
router.get('/:instanceId/:dbIndex', function (req, res) {
    res.status(200).json(res.locals.events);
});
exports.default = router;
