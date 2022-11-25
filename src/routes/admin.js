const express = require('express');
const router = express.Router();
const AdminController = require('../app/controllers/AdminController');
const AuthController = require('../app/controllers/AuthController');
const AuthMiddleware = require('../app/middlewares/AuthMiddleware');
const { upload } = require('../app/middlewares/UploadMiddleware');

router.get('/login', AuthController.getAdminForm);
router.post('/loginAdminStore', AuthController.loginAdminStore);
//group middleware
router.use(AuthMiddleware.verifyAdmin);
//Admin/User
router.post('/user/check-user-action', AdminController.checkUserAction);
router.get('/user/list', AdminController.getListUser);
router.post('/user/store', upload.single('image'), AdminController.storeUser);
router.delete('/user/:id/delete', AdminController.deleteUser);
router.get('/user/trash', AdminController.getListTrashUser);
router.patch('/user/:id/restore', AdminController.restoreUser);
router.delete('/user/:id/detroy', AdminController.detroyUser);
router.get('/user/create', AdminController.createUser);
router.get('/user/:id/edit', AdminController.editUser);
router.put(
    '/user/:id/update',
    upload.single('image'),
    AdminController.updateUser,
);
//admin/categogies
router.get('/categories/create', AdminController.createProduct);
router.get('/categories/list', AdminController.getListcategories);
router.get('/categories/trash', AdminController.trashProduct);
//admin/product
router.get('/list', AdminController.getListProduct);
router.get('/create', AdminController.createProduct);
router.get('/trash', AdminController.trashProduct);
router.get('/profile', AdminController.getProfile);
router.post('/store', upload.single('image'), AdminController.storeProduct);
router.post('/check-product-action', AdminController.checkProductAction);
router.get('/:id/edit', AdminController.editProduct);
router.put(
    '/:id/update',
    upload.single('image'),
    AdminController.updateProduct,
);
router.delete(
    '/:id/delete',

    AdminController.deleteProduct,
);
router.delete('/:id/detroy', AdminController.detroyProduct);
router.patch('/:id/restore', AdminController.restoreProduct);
router.get('/list', AdminController.getListProduct);
router.get('/Dashboard', AdminController.getListProduct);
router.get('/:slug', AdminController.getListProduct);
router.get('/', AdminController.getListProduct);
module.exports = router;
