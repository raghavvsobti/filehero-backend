"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const usersRoutes_1 = __importDefault(require("./routes/usersRoutes"));
const fileRoutes_1 = __importDefault(require("./routes/fileRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const cors_1 = __importDefault(require("cors")); // Import CORS
const cloudinary_1 = require("cloudinary");
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
const corsOptions = {
    origin: (origin, callback) => {
        // Allow requests from any origin
        callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Access-Control-Allow-Origin'],
    credentials: true, // Allow cookies and authentication headers
};
app.use((0, cors_1.default)(corsOptions));
app.options('*', (0, cors_1.default)(corsOptions));
app.use('/api', usersRoutes_1.default);
app.use('/file', fileRoutes_1.default);
app.use('/auth', authRoutes_1.default);
// Cloudinary configuration
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
app.get('/', (req, res) => {
    res.send('Welcome to the API!');
});
const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
