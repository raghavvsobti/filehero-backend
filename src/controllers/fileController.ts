import { Request, Response } from 'express';
import { uploadFile, uploadToCloudinary } from '../cloudinary';
import prisma from '../config/db';


interface PostUploadForm extends Request {
    params: {
        id: string;
    };
    body: {
        taggedUserId?: string;
    };
}


export const uploadFileForm = async (req: PostUploadForm, res: Response): Promise<void> => {
    const { id } = req.params;

    // Using multer to handle file upload
    uploadFile(req, res, async (err: any) => {
        if (err) {
            res.status(400).json({ msg: 'File upload error', error: err.message });
            return;
        }

        try {
            const user = await prisma.user.findUnique({ where: { id } });
            if (!user) {
                res.status(404).json({ msg: 'User not found' });
                return;
            }

            // Uploading file to Cloudinary
            let fileUrl = '';
            if (req.file) {
                const uploadResult = await uploadToCloudinary(req.file);
                fileUrl = uploadResult.secure_url; // Cloudinary URL of the uploaded file
            }

            const newFileMaster = await prisma.fileMaster.create({
                data: {
                    url: fileUrl,
                    userId: id,
                    taggedUserId: req.body.taggedUserId,
                }
            })

            res.status(200).json({
                msg: 'File uploaded successfully!',
                fileMaster: newFileMaster,
            });
        } catch (err: any) {
            res.status(500).json({ msg: 'Server error', error: err.message });
        }
    });
};



interface UpdateFileRequest extends Request { 
    params: {
        masterFileId: string;
    }
}

export const updateViewsCount = async (req: UpdateFileRequest, res: Response): Promise<void> => { 
    const { masterFileId } = req.params;

    try {
        const user = await prisma.fileMaster.findUnique({ where: { id: masterFileId } });
        if (!user) {
            res.status(404).json({ msg: 'File not found!' });
            return;
        }

        const updatedMasterFile = await prisma.fileMaster.update({
            where: { id: masterFileId },
            data: {
                views: {
                increment: 1
            } },
        });

        res.redirect(updatedMasterFile?.url);
        res.status(200).json({ msg: 'File Updated Successfully!', file: updatedMasterFile });
    } catch (err: any) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
}

// Get all files by user id
export const getFilesByUserId = async (req: Request, res: Response) => {
    const { id } = req?.params;
    try {
        const users = await prisma.fileMaster.findMany({
            where: { 
                userId: id
            },
            orderBy: {
                order: "asc"
            }
        });
        res.status(200).json(users);
    } catch (err : any) {
        res.status(500).json({ msg: 'Server error', error: err.message });
    }
};