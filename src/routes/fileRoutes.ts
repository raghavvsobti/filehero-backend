import express from "express";
import {
  uploadFileForm,
  updateViewsCount,
  getFilesByUserId,
  changeOrder,
} from "../controllers/fileController";
import isAuthenticated from "../middlewares/isAuthenticated";

const router = express.Router();

// :id is userId
router.post("/upload/:id", isAuthenticated, uploadFileForm);
router.get("/:masterFileId", updateViewsCount);
router.get("/files/:id", isAuthenticated, getFilesByUserId);
router.put("/changeOrder", isAuthenticated, changeOrder);

export default router;
