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
exports.getFilesByUserId = exports.updateViewsCount = exports.uploadFileForm = void 0;
const cloudinary_1 = require("../cloudinary");
const db_1 = __importDefault(require("../config/db"));
const uploadFileForm = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    // Using multer to handle file upload
    (0, cloudinary_1.uploadFile)(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        if (err) {
            res.status(400).json({ msg: 'File upload error', error: err.message });
            return;
        }
        try {
            const user = yield db_1.default.user.findUnique({ where: { id } });
            if (!user) {
                res.status(404).json({ msg: 'User not found' });
                return;
            }
            // Uploading file to Cloudinary
            let fileUrl = '';
            if (req.file) {
                const uploadResult = yield (0, cloudinary_1.uploadToCloudinary)(req.file);
                fileUrl = uploadResult.secure_url; // Cloudinary URL of the uploaded file
            }
            const newFileMaster = yield db_1.default.fileMaster.create({
                data: {
                    url: fileUrl,
                    userId: id,
                    taggedUserId: req.body.taggedUserId,
                }
            });
            res.status(200).json({
                msg: 'File uploaded successfully!',
                fileMaster: newFileMaster,
            });
        }
        catch (err) {
            res.status(500).json({ msg: 'Server error', error: err.message });
        }
    }));
});
exports.uploadFileForm = uploadFileForm;
const updateViewsCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { masterFileId } = req.params;
    try {
        const user = yield db_1.default.fileMaster.findUnique({ where: { id: masterFileId } });
        if (!user) {
            res.status(404).json({ msg: 'File not found!' });
            return;
        }
        const updatedMasterFile = yield db_1.default.fileMaster.update({
            where: { id: masterFileId },
            data: {
                views: {
                    increment: 1
                }
            },
        });
        res.redirect(updatedMasterFile === null || updatedMasterFile === void 0 ? void 0 : updatedMasterFile.url);
        res.status(200).json({ msg: 'File Updated Successfully!', file: updatedMasterFile });
    }
    catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});
exports.updateViewsCount = updateViewsCount;
// Get all files by user id
const getFilesByUserId = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req === null || req === void 0 ? void 0 : req.params;
    try {
        const users = yield db_1.default.fileMaster.findMany({
            where: {
                userId: id
            },
            orderBy: {
                order: "asc"
            }
        });
        res.status(200).json(users);
    }
    catch (err) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
});
exports.getFilesByUserId = getFilesByUserId;
