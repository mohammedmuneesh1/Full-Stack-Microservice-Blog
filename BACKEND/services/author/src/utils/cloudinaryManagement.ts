import type { UploadApiErrorResponse } from "cloudinary";
import cloudinary from "../config/cloudinaryConfig.js";
import type { UploadApiResponse } from "cloudinary";


const cloudinaryManagment ={

  uploadItem: (buffer: Buffer,folderName="demo"): Promise<UploadApiResponse | undefined> => {
    return new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        { folder: `${process.env.CLOUDINARY_PARENT_FOLDER}/${folderName}` },
        (error?: UploadApiErrorResponse, result?: UploadApiResponse) => {
          if (error) reject(error);
          else resolve(result as UploadApiResponse);
        }
      );
      stream.end(buffer);
    });
},

  deleteItem: (public_id: string) => {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.destroy(public_id, (error, result) => {
        if (error) reject(error);
        else resolve(result);
      });
    });
  }
}


export default cloudinaryManagment;


// const results = await Promise.all(
//   req.files.map((file: any) =>
//     cloudinaryOptions.uploadItem(file.buffer, "yourFolder")
//   )
// );