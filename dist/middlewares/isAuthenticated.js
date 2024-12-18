"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const isAuthenticated = (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
        return res.status(401).json({ msg: 'No token provided, authorization denied' });
    }
    const bearerToken = token.split(' ')[1];
    if (!bearerToken) {
        return res.status(401).json({ msg: 'Invalid token format' });
    }
    jsonwebtoken_1.default.verify(bearerToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ msg: 'Token is not valid' });
        }
        req.body.user = decoded;
        next();
    });
};
exports.default = isAuthenticated;
