import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'; // Node.js File System module
(async function() {

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    })})();


const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) {
            return null
            
        }else{
            const response = await cloudinary.uploader.upload(localFilePath => {
                resource_type: 'auto',
                //file has now been uploaded to Cloudinary
                console.log('file is uploaded to Cloudinary,url is ',response.url);
                return response
            })
        }
    } catch (error) {
        fs.unlinkSync(localFilePath);//delete the file from the local storage
        return null;
    }
}
export {uploadOnCloudinary}