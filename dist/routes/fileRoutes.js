"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fileController_1 = require("../controllers/fileController");
const isAuthenticated_1 = __importDefault(require("../middlewares/isAuthenticated"));
const router = express_1.default.Router();
// :id is userId
router.post('/upload/:id', isAuthenticated_1.default, fileController_1.uploadFileForm);
router.get('/file/:masterFileId', fileController_1.updateViewsCount);
router.get('/files/:id', isAuthenticated_1.default, fileController_1.getFilesByUserId);
exports.default = router;
