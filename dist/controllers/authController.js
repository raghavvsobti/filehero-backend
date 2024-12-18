"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logoutUser = exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../config/db"));
const registerUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, email, password } = req.body;
    try {
        const existingUser = yield db_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            res.status(400).json({ msg: 'User already exists' });
            return;
        }
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        const user = yield db_1.default.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });
        res.status(201).json({ msg: 'User registered successfully', user });
    }
    catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});
exports.registerUser = registerUser;
const loginUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        // Finding the user by email
        const user = yield db_1.default.user.findUnique({ where: { email } });
        if (!user) {
            res.status(400).json({ msg: 'Invalid credentials' });
            return;
        }
        // Comparing passwords
        const isMatch = yield bcryptjs_1.default.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ msg: 'Invalid credentials' });
            return;
        }
        // Generating JWT token
        const token = jsonwebtoken_1.default.sign({ user }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        });
        // sending token so can be stored in session or local storage on client side
        res.status(200).json({ token, user });
    }
    catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});
exports.loginUser = loginUser;
const logoutUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Assuming a stateless logout, the client should handle token removal.
        // If token invalidation is required, we can implement a token blacklist system.
        res.status(200).json({ msg: 'Successfully logged out' });
    }
    catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});
exports.logoutUser = logoutUser;
// also refresh token implementation can be done
