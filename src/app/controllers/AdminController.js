const res = require('express/lib/response');
const Product = require('../models/Product');
const {ACCESS_SECRET_TOKEN,REFRESH_SECRET_TOKEN} = require('../../config/envConfig')
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt =  require('bcryptjs');



const {
    multipleMongooseToObject,
    mongooseToObject,
} = require('../../util/mongoose');
class AdminController {
    //[GET] /admin/register
    getRegisterForm(req, res, next) {
        res.render('admin/register');
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
    registerStore(req, res, next) {
        const { username, fullname, phone, email, password } = req.body;
        console.log(fullname)
        User.findOne({ email })
            .then((user) => {
                let foundUser = mongooseToObject(user);
                if (foundUser) {
                    return res.json({ msg: 'Email đã tồn tại ' });
                }
                const newUser = new User({
                    username,
                    fullname,
                    phone,
                    email,
                    password,
                });
                newUser.save();
                let UserToken = new AdminController();
                const token = UserToken.encodeToken(newUser._id);
                res.json(token);
            })
            .catch(next);
    }
    getloginForm(req, res, next) {
        res.render('admin/login', { title: 'Admin | login' });
    }
    getloginList(req, res, next){
        const accessToken = jwt.sign(email,ACCESS_SECRET_TOKEN);    
        console.log(accessToken)
        var myHeaders =  new Headers()
        myHeaders.append('Content-Type','application/json; charset=utf-8');
        myHeaders.append('Authorization', 'Bearer ' + accessToken); 
        res.json(lists.filter(list=>list.email ===req.user.email))
    }
    loginStore(req, res,next) {
     const {email,password} = req.body;
     const accessToken = jwt.sign(email,ACCESS_SECRET_TOKEN);
     res.json(accessToken)

  
    }
    authenticateToken(req, res, next) {
        const authHeader = req.headers["Authorization"];
        console.log(authHeader)
        const token = authHeader && authHeader.split(' ')[1];
        console.log(token)
        if(!token) return res.sendStatus(401);
        jwt.verify(token,ACCESS_SECRET_TOKEN,(err,user)=>{
            if(err) return res.sendStatus(403);
            res.user = user;
            next()
        })  
    }
    secret(req, res) {
        res.json({resource: true})
    }

    getListProduct(req, res, next) {
        let sort = res.locals;
        let productQuery = Product.find({});
        if (req.query.hasOwnProperty('sort')) {
            productQuery = productQuery.sort({
                [req.query.column]: req.query.type,
            });
        }
        Promise.all([productQuery, Product.countDocumentsDeleted()])
            .then(([products, deletedCount]) => {
                res.render('admin/list', {
                    title: 'Admin | List',
                    deletedCount,
                    sort,
                    products: multipleMongooseToObject(products),
                    layout: 'admin',
                });
            })
            .catch(next);
    }
    //[GET] /admin/create
    createProduct(req, res) {
        res.render('admin/create', {
            title: 'Admin | Create',
            layout: 'admin',
        });
    }
    //[GET] /admin/: id/edit
    editProduct(req, res, next) {
        Product.findById(req.params.id)

            .then((product) => {
                res.render('admin/edit', {
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
        req.body.image = formData;
        const product = new Product(req.body);
        product
            .save()
            .then(() => res.redirect('/admin/list'))
            .catch(next);
    }
    //[POST] /admin/:id/update
    updateProduct(req, res, next) {
        res.json(req.body);
        Product.updateOne({ _id: req.params.id }, req.body)
            .then(() => res.redirect('/admin/list'))
            .catch(next);
    }
    deleteProduct(req, res, next) {
        Product.delete({ _id: req.params.id })
            .then(() => res.redirect('back'))
            .catch(next);
    }
    // /[GET] /admin/trash
    trashProduct(req, res, next) {
        Product.findDeleted({})
            .then((products) => {
                res.render('admin/trash-product', {
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
    checkAction(req, res, next) {
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
