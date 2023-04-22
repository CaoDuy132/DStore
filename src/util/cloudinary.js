const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});
  const deleteImgCloud = async function(table_name,public_id){
    const table = await table_name.findById(public_id);
    if(table.image.public_id){
      cloudinary.uploader.destroy(`${table.image.public_id}`)
    }
}
const storage = new CloudinaryStorage({
  cloudinary,
  allowedFormats: ['jpg','JPG','jpeg','JPEG','png','PNG','gif','GIF'],
  params: {
    folder: 'image',
    public_id: (req, file) => `${Date.now().toString()}${file.originalname}`,
  },
})
const uploadCloud = multer({ storage});
module.exports=uploadCloud
module.exports.deleteImgCloud=deleteImgCloud
