import express from 'express';
import { uploadFileForm, updateViewsCount, getFilesByUserId } from '../controllers/fileController';
import isAuthenticated from '../middlewares/isAuthenticated';

const router = express.Router();

// :id is userId
router.post('/upload/:id',isAuthenticated,uploadFileForm); 
router.get('/file/:masterFileId', updateViewsCount); 
router.get('/files/:id', isAuthenticated, getFilesByUserId)


export default router;