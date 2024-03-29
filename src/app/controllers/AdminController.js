const res = require('express/lib/response');
const Product = require('../models/Product');
const User = require('../models/User');
const {
    multipleMongooseToObject,
    mongooseToObject,
} = require('../../util/mongoose');
const uploadCloud = require('../../util/cloudinary');
const AdminController = {
    search: (req, res, next) => {
        const searchTerm = req.body.query;
        // escape-string-regexp is an (ESM) and you are trying to use it in a CommonJS module
        import('escape-string-regexp')
            .then((escapeStringRegexp) => {
                const escapedSearchTerm =
                    escapeStringRegexp.default(searchTerm);
                Product.find(
                    { name: { $regex: new RegExp(escapedSearchTerm, 'i') } },
                    function (err, result) {
                        if (err) {
                            next(err);
                        }
                        return res.json(result);
                    },
                );
            })
            .catch((err) => {
                next(err);
            });
    },
    getProfile: async (req, res, next) => {
        const currentUser = await req.user;
        try {
            res.render('admin/user/profile', {
                currentUser: mongooseToObject(currentUser),
                title: 'Admin | Profile',
                layout: 'admin',
            });
        } catch (err) {
            console.log(err);
        }
    },
    getListUser: (req, res, next) => {
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
    },
    createUser: (req, res, next) => {
        res.render('admin/user/create', { layout: 'admin' });
    },
    // /[DELETE] /admin/:id/delete
    deleteUser: (req, res, next) => {
        User.delete({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    },
    //[GET] /admin/: id/edit
    editUser: (req, res, next) => {
        User.findById(req.params.id)
            .then((user) => {
                var isAdmin = req.user.role >= 1 ? true : false;
                res.render('admin/user/edit', {
                    title: 'Admin | Edit',
                    user: mongooseToObject(user),
                    isAdmin,
                    layout: 'admin',
                });
            })
            .catch(next);
    },
    //[POST] /admin/:id/update
    updateUser: async (req, res, next) => {
        const id = req.params.id;
        try {
            if (req.file) {
                req.body.image = {
                    public_id: req.file.filename,
                    url: req.file.path,
                };
            }
            await uploadCloud.deleteImgCloud(User, req.params.id);
            await User.updateMany({ _id: id }, req.body);
            res.redirect('/admin/user/list');
        } catch (err) {
            next(err);
        }
    },
    // /[POST] /admin/check-user-action/
    checkUserAction: (req, res, next) => {
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
    },
    // /[GET] /admin/user/trash
    getListTrashUser: (req, res, next) => {
        User.findDeleted({})
            .then((users) => {
                res.render('admin/user/trash-user', {
                    title: 'Admin | Trash',
                    users: multipleMongooseToObject(users),
                    layout: 'admin',
                });
            })
            .catch(next);
    },
    //[POST] /admin/user/store
    storeUser: async (req, res, next) => {
        const { fullname, email, password, phone, address } = req.body;
        try {
            if (!req.file) {
                next(new Error('No file uploaded!'));
                return;
            }
            const user = await User({
                fullname,
                email,
                password,
                phone,
                address,
                image: {
                    public_id: req.file.filename,
                    url: req.file.path,
                },
            });
            await user.save();
            res.redirect('/admin/user/list');
        } catch (err) {
            next(err);
        }
    },
    // /[PATCH] /admin/user:id/restore
    restoreUser: (req, res, next) => {
        User.restore({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    },
    // /[PATCH] /admin/user/:id/detroy
    detroyUser: (req, res, next) => {
        User.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    },
    //[GET] admin/categories/list
    getListcategories: (req, res, next) => {
        let sort = res.locals;
        let categoriesQuery = Category.find({});
        if (req.query.hasOwnProperty('sort')) {
            categoriesQuery = categoriesQuery.sort({
                [req.query.column]: req.query.type,
            });
        }
        Promise.all([categoriesQuery, Product.countDocumentsDeleted()])
            .then(([categories, deletedCount]) => {
                res.render('admin/categogy/list', {
                    title: 'Admin | List',
                    deletedCount,
                    sort,
                    categories: multipleMongooseToObject(categories),
                    layout: 'admin',
                });
            })
            .catch(next);
    },
    //[GET] admin/list
    getListProduct: (req, res, next) => {
        var page = req.query.page;
        let currentUser = req.user;
        let sort = res.locals;
        const PAGE_SIZE = 5;
        var productQuery = Product.find({});
        if (page) {
            productQuery = Product.find({})
                .skip(PAGE_SIZE * parseInt(page) - PAGE_SIZE)
                .limit(PAGE_SIZE);
        }
        if (req.query.hasOwnProperty('sort')) {
            productQuery = productQuery.sort({
                [req.query.column]: req.query.type,
            });
        }
        Promise.all([
            productQuery,
            Product.countDocuments(),
            Product.countDocumentsDeleted(),
            currentUser,
        ])
            .then(([products, pageCount, deletedCount, currentUser]) => {
                res.render('admin/product/list', {
                    title: 'Admin | List',
                    pageCount,
                    deletedCount,
                    sort,
                    currentUser,
                    products: multipleMongooseToObject(products),
                    layout: 'admin',
                });
            })
            .catch(next);
    },
    //[GET] /admin/create
    createProduct(req, res) {
        res.render('admin/product/create', {
            title: 'Admin | Create',
            layout: 'admin',
        });
    },
    //[GET] /admin/: id/edit
    editProduct: (req, res, next) => {
        Product.findOne({ _id: req.params.id })
            .then((product) => {
                res.render('admin/product/edit', {
                    title: 'Admin | Edit',
                    product: mongooseToObject(product),
                    layout: 'admin',
                });
            })
            .catch(next);
    },
    //[POST] /admin/store
    storeProduct: (req, res, next) => {
        if (!req.file) {
            next(new Error('No file uploaded!'));
            return;
        }
        const image = {
            public_id: req.file.filename,
            url: req.file.path,
        };
        const { name, price, description } = req.body;
        const product = new Product({
            name,
            price,
            description,
            image,
        });
        product
            .save()
            .then(() => res.redirect('/admin/list'))
            .catch(next);
    },
    //[POST] /admin/:id/update
    updateProduct: async (req, res, next) => {
        try {
            if (req.file) {
                req.body.image = {
                    public_id: req.file.filename,
                    url: req.file.path,
                };
            }
            await uploadCloud.deleteImgCloud(Product, req.params.id);
            await Product.updateOne({ _id: req.params.id }, req.body);
            res.redirect('/admin/list');
        } catch (err) {
            next(new Error(err));
        }
    },
    // /[DELETE] /admin/:id/delete
    deleteProduct: (req, res, next) => {
        Product.delete({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    },
    // /[GET] /admin/trash
    trashProduct: (req, res, next) => {
        Product.findDeleted({})
            .then((products) => {
                res.render('admin/product/trash-product', {
                    title: 'Admin | Trash',
                    products: multipleMongooseToObject(products),
                    layout: 'admin',
                });
            })
            .catch(next);
    },
    // /[PATCH] /admin/:id/restore
    restoreProduct: (req, res, next) => {
        Product.restore({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    },
    // /[PATCH] /admin/:id/detroy
    detroyProduct: (req, res, next) => {
        Product.deleteOne({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    },

    // /[POST] /admin/check-action/
    checkProductAction: (req, res, next) => {
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
    },
};
module.exports = AdminController;
