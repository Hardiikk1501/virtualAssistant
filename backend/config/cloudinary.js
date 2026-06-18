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
     if(fs.existsSync(file)){
      fs.unlinkSync(file);
    }
    
    return uploadResult.secure_url;
  }catch (error) {
     if(file && fs.existsSync(file)) {
      fs.unlinkSync(file);
    }
    console.error('Image upload error:', error);
  }
}
export default uploadCloudinary;
