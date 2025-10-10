"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleUploadError = exports.deleteFile = exports.getFileUrl = exports.uploadFiles = exports.uploadCSV = exports.uploadFile = exports.uploadImages = exports.uploadImage = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path_1.default.join(__dirname, "../../public/storage");
        fs_1.default.mkdirSync(uploadPath, { recursive: true });
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        // cb(null, uniqueName);
        const originalName = file.originalname;
        cb(null, originalName);
    },
});
// const imageFilter = (
//   req: Request,
//   file: Express.Multer.File,
//   cb: multer.FileFilterCallback
// ) => {
//   if (
//     file.mimetype === "image/png" ||
//     file.mimetype === "image/jpg" ||
//     file.mimetype === "image/jpeg"
//   ) {
//     cb(null, true);
//   } else {
//     cb(new Error("Only .png, .jpg and .jpeg format allowed!"));
//   }
// };
const imageFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        "image/png",
        "image/jpg",
        "image/jpeg",
        "image/gif",
        "image/webp",
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("Only .png, .jpg, .jpeg, .gif, and .webp formats are allowed!"));
    }
};
// File filter (updated to handle CSV)
const fileFilter = (req, file, cb) => {
    const allowedMimeTypes = [
        "text/csv",
        "application/vnd.ms-excel",
        "text/plain", // Some CSV files may have this mime type
        "application/csv",
        "application/x-csv",
        "text/x-csv",
        "text/comma-separated-values",
        "text/x-comma-separated-values",
    ];
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("Only CSV files are allowed!"));
    }
};
// CSV-specific filter (optional, if you want separate handling)
const csvFilter = (req, file, cb) => {
    if (file.mimetype === "text/csv" ||
        file.mimetype === "application/vnd.ms-excel" ||
        path_1.default.extname(file.originalname).toLowerCase() === ".csv") {
        cb(null, true);
    }
    else {
        cb(new Error("Only CSV files are allowed!"));
    }
};
exports.uploadImage = (0, multer_1.default)({
    storage: storage,
    fileFilter: imageFilter,
    limits: { fileSize: 5 * 1024 * 1024 },
}).single("file");
exports.uploadImages = (0, multer_1.default)({
    storage: storage,
    fileFilter: imageFilter,
    limits: { fileSize: 10 * 1024 * 1024, files: 100 },
}).array("images", 100);
exports.uploadFile = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter, // Now properly checks for CSV
    limits: { fileSize: 20 * 1024 * 1024 },
}).single("file");
// New dedicated CSV upload middleware
exports.uploadCSV = (0, multer_1.default)({
    storage: storage,
    fileFilter: csvFilter,
    limits: { fileSize: 20 * 1024 * 1024 },
}).single("csvfile"); // Using different field name for clarity
exports.uploadFiles = (0, multer_1.default)({
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 20 * 1024 * 1024, files: 10 },
}).array("files", 10);
const getFileUrl = (filename) => {
    return `/storage/${filename}`;
};
exports.getFileUrl = getFileUrl;
const deleteFile = (filename) => {
    const filePath = path_1.default.join(__dirname, "../../public/storage", filename);
    if (fs_1.default.existsSync(filePath)) {
        fs_1.default.unlinkSync(filePath);
        return true;
    }
    return false;
};
exports.deleteFile = deleteFile;
// export const deleteFile = async (filename: string): Promise<boolean> => {
//   const filePath = path.join(__dirname, "../../public/storage", filename);
//   try {
//     await fs.promises.unlink(filePath);
//     return true;
//   } catch (error) {
//     if (error.code === 'ENOENT') {
//       // File doesn't exist
//       return false;
//     }
//     throw error; // Re-throw other errors
//   }
// };
const handleUploadError = (err, req, res, next) => {
    if (err instanceof multer_1.default.MulterError) {
        return res.status(400).json({
            success: false,
            message: err.message,
        });
    }
    else if (err) {
        return res.status(500).json({
            success: false,
            message: err.message || "File upload failed",
        });
    }
    next();
};
exports.handleUploadError = handleUploadError;
