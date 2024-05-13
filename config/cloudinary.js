const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
require("dotenv").config();

//configure cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRETE
});

const imageUpload = new CloudinaryStorage({
    cloudinary,
    allowedFormats: ["jpg", "png", "jpeg", "mpeg"],
    params: {
      folder: "blog-api", // Optional: specify folder for uploaded images
      // You can add more parameters here as needed
      transformation: [{width: 500, height: 500, crop:"limit"}],
    },
  });

module.exports=imageUpload;