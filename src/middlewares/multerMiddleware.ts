import multer from "multer";
import path from "path";
import fs from "fs";

// creates afolder if it does not exist
const createUploadsFolder = (folderpath: string) => {
    if(!fs.existsSync(folderpath)) {
        fs.mkdirSync(folderpath, {recursive: true});
    }
};

// configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadpath = path.join("uploads", "profile");
        createUploadsFolder(uploadpath)
        cb(null, uploadpath); //folder where images will be stored
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

// file filter to allow only images
const fileFilter = (req: any, file: any, cb: any) => {
    const allowedTypes = /jpeg|jpg|png/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimeType = allowedTypes.test(file.mimetype);
    if (extname && mimeType) {
        return cb(null, true);
    } else {
        cb("only images are allowed");
    }
}

export const uploads =  multer({ storage, fileFilter});