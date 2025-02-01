const axios = require('axios');

const IMGUR_API_URL = 'https://api.imgur.com/3';

// Upload image to Imgur
// exports.uploadToImgur = async (imageBuffer) => {
    
//     const base64Image = imageBuffer.toString('base64');
//     const response = await axios.post(
//         `${IMGUR_API_URL}/image`,
//         { image: base64Image, type: 'base64', visibility: 'hidden' },
//         {
//             headers: {
//                 Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
//             },
//         }
//     );    
//       console.log(response.data.data);
      
//   return response.data.data;
// };

// Delete image from Imgur 
// exports.deleteFromImgur = async (deleteHash) => {
//   try {
//     await axios.delete(`${IMGUR_API_URL}/image/${deleteHash}`, {
//       headers: {
//         Authorization: `Client-ID ${process.env.IMGUR_CLIENT_ID}`,
//       },
//     });
//   } catch (err) {
//     console.error('Error deleting image from Imgur:', err.message);
//   }
// };


const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET_KEY
});

module.exports = cloudinary;