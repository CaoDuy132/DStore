const express = require('express');
const router = express.Router();
const AdminController = require('../app/controllers/AdminController');
const multer = require('multer');
const path = require('path');
var appRoot = require('app-root-path');


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, appRoot + '/src/public/images/');
    },

    // By default, multer removes file extensions so let's add them back
    filename: function (req, file, cb) {
        cb(
            null,
            file.fieldname + '-' + Date.now() + path.extname(file.originalname),
        );
    },
});
const imageFilter = function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};
let upload = multer({ storage: storage, fileFilter: imageFilter });

router.get('/register', AdminController.getRegisterForm);
router.get('/login', AdminController.getloginForm);
router.get('/login/list',AdminController.authenticateToken,AdminController.getloginList);
router.post('/login/store', AdminController.loginStore);
router.post('/register/store', AdminController.registerStore);
router.post('/secret', AdminController.secret);
router.get('/create', AdminController.createProduct);
router.get('/list', AdminController.getListProduct);
router.get('/trash', AdminController.trashProduct);
router.post(
    '/store',
    upload.single('profile_pic'),
    AdminController.storeProduct,
);
router.post('/check-action', AdminController.checkAction);
router.get('/:id/edit', AdminController.editProduct);
router.put('/:id/update', AdminController.updateProduct);
router.delete('/:id/delete', AdminController.deleteProduct);
router.delete('/:id/detroy', AdminController.detroyProduct);
router.patch('/:id/restore', AdminController.restoreProduct);
router.get('/:slug', AdminController.getListProduct);

module.exports = router;
