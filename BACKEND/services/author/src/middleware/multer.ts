import multer from "multer";

 function createUploadMulter(fileSizeInMB=5) {
  return multer({
    storage: multer.memoryStorage(),
    limits: {
      fileSize: fileSizeInMB * 1024 * 1024
    },

    // fileFilter: (req: Request, file, cb) => {
    //   if (!file.mimetype.startsWith("image/")) {
    //     return cb(new Error("Invalid file type"));
    //   }
    //   cb(null, true);
    // }
  });
}

export default createUploadMulter;
//createUpload(20).single("video");