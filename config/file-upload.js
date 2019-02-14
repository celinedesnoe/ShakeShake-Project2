const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

const storage = cloudinaryStorage({
  cloudinary,
  folder: "cocktail-pictures"

  // to upload things that are NOT images
  // params: {
  //   resource_type: "raw"
  // }
});

// this is a Multer file upload object that should connect to a ROUTE
const fileUploader = multer({ storage });

module.exports = fileUploader;

module.exports = fileUploader;
