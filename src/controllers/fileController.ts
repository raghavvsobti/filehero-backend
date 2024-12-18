import { Request, Response } from "express";
import { uploadFile, uploadToCloudinary } from "../cloudinary";
import prisma from "../config/db";

interface PostUploadForm extends Request {
  params: {
    id: string;
  };
  body: {
    tag: string;
  };
}

export const uploadFileForm = async (
  req: PostUploadForm,
  res: Response
): Promise<void> => {
  const { id } = req.params;

  // Uploading file to Cloudinary
  let fileUrl = "";
  if (req.file) {
    const uploadResult = await uploadToCloudinary(req.file);
    fileUrl = uploadResult.secure_url; // Cloudinary URL of the uploaded file
  }

  // Using multer to handle file upload
  uploadFile(req, res, async (err: any) => {
    if (err) {
      res.status(400).json({ msg: "File upload error", error: err.message });
      return;
    }

    try {
      const user = await prisma.user.findUnique({ where: { id } });
      if (!user) {
        res.status(404).json({ msg: "User not found" });
        return;
      }

      let fileUrl = "";
      if (req.file) {
        const uploadResult = await uploadToCloudinary(req.file);
        fileUrl = uploadResult.secure_url; // Cloudinary URL of the uploaded file
      }

      if (req.body.tag?.toString()?.length === 0 || !req.body.tag) {
        res.status(401).json({ msg: "Tag cannot be empty!" });
        return;
      }

      const foundTag = await prisma.fileMaster.findFirst({
        where: {
          tag: {
            equals: req.body.tag,
          },
        },
      });

      if (foundTag) {
        res.status(401).json({ msg: "Tag already used!" });
        return;
      }

      const newFileMaster = await prisma.fileMaster.create({
        data: {
          url: fileUrl,
          userId: id,
          tag: req.body.tag,
        },
      });

      res.status(200).json({
        msg: "File uploaded successfully!",
        fileMaster: newFileMaster,
      });
    } catch (err: any) {
      res.status(500).json({ msg: "Server error", error: err.message });
    }
  });
};

interface UpdateFileRequest extends Request {
  params: {
    masterFileId: string;
  };
}

export const updateViewsCount = async (
  req: UpdateFileRequest,
  res: Response
): Promise<void> => {
  const { masterFileId } = req.params;

  try {
    const user = await prisma.fileMaster.findUnique({
      where: { id: masterFileId },
    });
    if (!user) {
      res.status(404).json({ msg: "File not found!" });
      return;
    }

    const updatedMasterFile = await prisma.fileMaster.update({
      where: { id: masterFileId },
      data: {
        views: {
          increment: 1,
        },
      },
    });

    res.redirect(updatedMasterFile?.url);
    res
      .status(200)
      .json({ msg: "File Updated Successfully!", file: updatedMasterFile });
  } catch (err: any) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

// Get all files by user id
export const getFilesByUserId = async (req: Request, res: Response) => {
  const { id } = req?.params;
  try {
    const users = await prisma.fileMaster.findMany({
      where: {
        userId: id,
      },
      orderBy: {
        order: "asc",
      },
    });
    res.status(200).json(users);
  } catch (err: any) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};

type OrderData = {
  id: string;
  order: number;
};

export const changeOrder = async (
  req: {
    body: {
      orderData: OrderData[];
    };
  },
  res: Response
) => {
  const { orderData } = req.body;
  try {
    for (let i = 0; i < orderData?.length; i++) {
      await prisma.fileMaster.update({
        where: {
          id: orderData[i]?.id,
        },
        data: {
          order: orderData[i]?.order,
        },
      });
    }
    res
      .status(200)
      .json({ msg: `Order changed for ${orderData?.length} files` });
  } catch (err: any) {
    res.status(500).json({ msg: "Server error", error: err.message });
  }
};
