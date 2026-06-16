import { v2 as cloudinary }from 'cloudinary';
import fs from 'fs';

const uploadCloudinary = async (file) => {

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET
});

   try {
    const uploadResult = await cloudinary.uploader.upload(file, {
      folder:"AI_Assistant", 
    });
    console.log(uploadResult.secure_url);
    return uploadResult.secure_url;
    fs.unlinkSync(file);  // Delete the local file after upload
  }catch (error) {
     fs.unlinkSync(file);  // Ensure the local file is deleted even if upload fails
    console.error('Image upload error:', error);
  }
}
export default uploadCloudinary;
