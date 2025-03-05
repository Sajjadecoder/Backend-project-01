import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv'; // Module to read environment variables from a .env file
dotenv.config(); // Read environment variables from file .env`
import fs from 'fs'; // Node.js File System module
(async function() {

    // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET
    })})();


    const uploadOnCloudinary = async (localFilePath) => {
        // console.log("cloud name: " + cloudinary.config().cloud_name)
        try {
            if (!localFilePath) {
                return null;
            } else {
                // Use the correct syntax for Cloudinary upload
                const response = await cloudinary.uploader.upload(localFilePath, {
                    resource_type: 'auto',  // Automatically determine the resource type (e.g., image, video)
                });
                console.log('File uploaded to Cloudinary. URL:', response.url);
                fs.unlinkSync(localFilePath);  // Delete the local file after upload
                return response;  // Return the response from Cloudinary
            }
        } catch (error) {
            // Delete the local file if upload fails
            fs.unlinkSync(localFilePath);
            console.error('Error uploading to Cloudinary:', error);
            return null;
        }
    }
    
export {uploadOnCloudinary}