const res = require('express/lib/response');
const Product = require('../models/Product');
const { ACCESS_SECRET_TOKEN } = require('../../config/envConfig');
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const {
    multipleMongooseToObject,
    mongooseToObject,
} = require('../../util/mongoose');
class AdminController {
    //[GET] /admin/register
    getRegisterForm(req, res, next) {
        res.render('log/register', { layout: false });
    }

    //[POST] /admin/register/store
    encodeToken(userID) {
        return jwt.sign(
            {
                iss: 'Cao Duy',
                sub: userID,
                iat: new Date().getTime(),
                exp: new Date().setDate(new Date().getDate() + 3),
            },
            ACCESS_SECRET_TOKEN,
        );
    }
    createToken(id) {
        return jwt.sign({ id }, ACCESS_SECRET_TOKEN, {
            expiresIn: new Date().setDate(new Date().getDate() + 3),
        });
    }
    registerStore(req, res, next) {
        const { fullname, phone, email, password } = req.body;
        User.findOne({ email })
            .then((user) => {
                let foundUser = mongooseToObject(user);
                if (foundUser) {
                    return res.json({ msg: 'Email đã tồn tại ', foundUser });
                }
                const newUser = new User({
                    fullname,
                    phone,
                    email,
                    password,
                });

                let UserToken = new AdminController();
                const token = UserToken.createToken(newUser._id);
                res.cookie('jwt', token, { httpOnly: true });
                newUser.save();
                res.redirect('/admin/login');
            })
            .catch(next);
    }
    getloginForm(req, res, next) {
        res.render('log/login', { title: 'Admin | login', layout: false });
    }
    loginStore(req, res, next) {
        const { email, password } = req.body;

        const user = User.findOne({ email })
            .then((user) => {
                const foundUser = mongooseToObject(user);

                if (foundUser) {
                    bcrypt
                        .compare(password, foundUser.password)
                        .then((data) => {
                            if (data) {
                                let UserToken = new AdminController();
                                const token = UserToken.createToken(
                                    foundUser._id,
                                );
                                res.cookie('jwt', token, { httpOnly: true });
                                res.redirect('/admin/list');
                            } else {
                                return res.json({
                                    success: false,
                                    massage: 'Mật khẩu không đúng',
                                });
                            }
                        })
                        .catch((error) => {
                            console.log(error);
                        });
                } else {
                    res.json({
                        success: false,
                        massage: 'Email không tồn tại',
                    });
                }
            })
            .catch(next);
    }

    getProfile(req, res, next) {
        let currenUserId = res.currentUserId;
        if (!currenUserId) {
            res.redirect('/admin/login');
        }
        User.findById({ _id: currenUserId })
            .then((user) => {
                res.render('admin/user/profile', {
                    currentUser: mongooseToObject(user),
                    title: 'Admin | Profile',
                    layout: 'admin',
                });
            })
            .catch(next);
    }
    getListUser(req, res, next) {
        let sort = res.locals;
        let userQuery = User.find({});
        if (req.query.hasOwnProperty('sort')) {
            userQuery = userQuery.sort({
                [req.query.column]: req.query.type,
            });
        }
        Promise.all([userQuery, User.countDocumentsDeleted()])
            .then(([users, deletedCount]) => {
                res.render('admin/user/list', {
                    title: 'Admin | List',
                    deletedCount,
                    sort,
                    users: multipleMongooseToObject(users),
                    layout: 'admin',
                });
            })
            .catch(next);
    }
    createUser(req, res, next) {
        res.render('admin/user/create', { layout: 'admin' });
    }
    editUser(req, res, next) {
        res.send('Edit');
    }
    // /[DELETE] /admin/:id/delete
    deleteUser(req, res, next) {
        User.delete({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }
    //[GET] /admin/: id/edit
    editUser(req, res, next) {
        User.findById(req.params.id)

            .then((user) => {
                res.render('admin/user/edit', {
                    title: 'Admin | Edit',
                    user: mongooseToObject(user),
                    layout: 'admin',
                });
            })
            .catch(next);
    }
    //[POST] /admin/:id/update
    updateUser(req, res, next) {
        if (req.file) {
            const formData = req.file.filename;
            req.body.image = formData;
        }
        User.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect('/admin/user/list'))
            .catch(next);
    }
    // /[POST] /admin/check-user-action/
    checkUserAction(req, res, next) {
        switch (req.body.action) {
            case 'delete': {
                User.delete({ _id: req.body.checkIDs })
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            }
            case 'detroy': {
                User.deleteMany({ _id: req.body.checkIDs })
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            }
            case 'restore': {
                User.restore({ _id: req.body.checkIDs })
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            }
            default:
                res.send('Lựa chọn không hợp lệ');
        }
    }
    // /[GET] /admin/user/trash
    getListTrashUser(req, res, next) {
        User.findDeleted({})
            .then((users) => {
                res.render('admin/user/trash-user', {
                    title: 'Admin | Trash',
                    users: multipleMongooseToObject(users),
                    layout: 'admin',
                });
            })
            .catch(next);
    }
    //[POST] /admin/user/store
    storeUser(req, res, next) {
        const formData = req.file.filename;
        const image = formData;
        const { fullname, email, password, phone, address } = req.body;
        const user = new User({
            fullname,
            email,
            password,
            phone,
            address,
            image,
        });
        user.save()
            .then(() => res.redirect('/admin/user/list'))
            .catch(next);
    }
    // /[PATCH] /admin/user:id/restore
    restoreUser(req, res, next) {
        User.restore({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }
    // /[PATCH] /admin/user/:id/detroy
    detroyUser(req, res, next) {
        User.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    //[GET] admin/list
    getListProduct(req, res, next) {
        let currenUserId = res.currentUserId;
        let currentUser = User.findById({ _id: currenUserId });
        let sort = res.locals;
        let productQuery = Product.find({});
        if (req.query.hasOwnProperty('sort')) {
            productQuery = productQuery.sort({
                [req.query.column]: req.query.type,
            });
        }
        Promise.all([
            productQuery,
            Product.countDocumentsDeleted(),
            currentUser,
        ])
            .then(([products, deletedCount, currentUser]) => {
                res.render('admin/product/list', {
                    title: 'Admin | List',
                    deletedCount,
                    sort,
                    products: multipleMongooseToObject(products),
                    currentUser: mongooseToObject(currentUser),
                    layout: 'admin',
                });
            })
            .catch(next);
    }
    //[GET] /admin/create
    createProduct(req, res) {
        res.render('admin/product/create', {
            title: 'Admin | Create',
            layout: 'admin',
        });
    }
    //[GET] /admin/: id/edit
    editProduct(req, res, next) {
        Product.findById(req.params.id)

            .then((product) => {
                res.render('admin/product/edit', {
                    title: 'Admin | Edit',
                    product: mongooseToObject(product),
                    layout: 'admin',
                });
            })
            .catch(next);
    }
    //[POST] /admin/store
    storeProduct(req, res, next) {
        const formData = req.file.filename;
        const image = formData;
        const { name, price, description } = req.body;
        const product = new Product({ name, price, description, image });
        product
            .save()
            .then(() => res.redirect('/admin/list'))
            .catch(next);
    }
    //[POST] /admin/:id/update
    updateProduct(req, res, next) {
        const formData = req.file.filename;
        const image = formData;
        res.json(image);
        Product.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect('/admin/list'))
            .catch(next);
    }
    // /[DELETE] /admin/:id/delete
    deleteProduct(req, res, next) {
        Product.delete({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }
    // /[GET] /admin/trash
    trashProduct(req, res, next) {
        Product.findDeleted({})
            .then((products) => {
                res.render('admin/product/trash-product', {
                    title: 'Admin | Trash',
                    products: multipleMongooseToObject(products),
                    layout: 'admin',
                });
            })
            .catch(next);
    }
    // /[PATCH] /admin/:id/restore
    restoreProduct(req, res, next) {
        Product.restore({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }
    // /[PATCH] /admin/:id/detroy
    detroyProduct(req, res, next) {
        Product.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }

    // /[POST] /admin/check-action/
    checkProductAction(req, res, next) {
        switch (req.body.action) {
            case 'delete': {
                Product.delete({ _id: req.body.checkIDs })
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            }
            case 'detroy': {
                Product.deleteMany({ _id: req.body.checkIDs })
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            }
            case 'restore': {
                Product.restore({ _id: req.body.checkIDs })
                    .then(() => res.redirect('back'))
                    .catch(next);
                break;
            }
            default:
                res.send('Lựa chọn không hợp lệ');
        }
    }
}
module.exports = new AdminController();
