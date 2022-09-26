const express = require('express');
const router = express.Router();
const AdminController = require('../app/controllers/AdminController');
const AuthMiddleware = require('../app/middlewares/AuthMiddleware');
const { upload } = require('../app/middlewares/UploadMiddleware');
//Admin/User
router.post(
    '/user/check-user-action',
    AuthMiddleware.verifyAdmin,
    AdminController.checkUserAction,
);
router.get('/user/list', AdminController.getListUser);
router.post('/user/store', upload.single('image'), AdminController.storeUser);
router.delete(
    '/user/:id/delete',
    AuthMiddleware.verifyAdmin,
    AdminController.deleteUser,
);
router.get(
    '/user/trash',
    AuthMiddleware.verifyAdmin,
    AdminController.getListTrashUser,
);
router.patch('/user/:id/restore', AdminController.restoreUser);
router.delete(
    '/user/:id/detroy',
    AuthMiddleware.verifyAdmin,
    AdminController.detroyUser,
);
router.get(
    '/user/create',
    AuthMiddleware.verifyAdmin,
    AdminController.createUser,
);
router.get(
    '/user/:id/edit',
    AuthMiddleware.verifyAdmin,
    AdminController.editUser,
);
router.put(
    '/user/:id/update',
    upload.single('image'),
    AdminController.updateUser,
);
//admin/categogies
router.get('/categogy/create', AdminController.createProduct);
router.get('/categogy/list', AdminController.getListcategogy);
router.get(
    '/categogy/trash',
    AuthMiddleware.verifyAdmin,
    AdminController.trashProduct,
);
//admin/
router.get(
    '/create',
    AuthMiddleware.verifyAdmin,
    AdminController.createProduct,
);
router.get('/list', AdminController.getListProduct);
router.get('/trash', AuthMiddleware.verifyAdmin, AdminController.trashProduct);
router.get('/profile', AdminController.getProfile);
router.post('/store', upload.single('image'), AdminController.storeProduct);
router.post(
    '/check-product-action',
    AuthMiddleware.verifyAdmin,
    AdminController.checkProductAction,
);
router.get(
    '/:id/edit',
    AuthMiddleware.verifyAdmin,
    AdminController.editProduct,
);
router.put(
    '/:id/update',
    upload.single('image'),
    AdminController.updateProduct,
);
router.delete(
    '/:id/delete',
    AuthMiddleware.verifyAdmin,
    AdminController.deleteProduct,
);
router.delete('/:id/detroy', AdminController.detroyProduct);
router.patch('/:id/restore', AdminController.restoreProduct);
router.get('/:slug', AdminController.getListProduct);
router.get('/', AdminController.getListProduct);
module.exports = router;
