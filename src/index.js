const express = require('express');
require('dotenv').config();
const path = require('path');
const app = express();
const { PORT } = process.env;
const route = require('./routes');
const db = require('./config/db');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
var methodOverride = require('method-override');
const SortMiddleware = require('./app/middlewares/SortMiddleware');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const {ACCESS_SECRET_TOKEN} = process.env;
const UserModel = require('./app/models/User')
db.connect();
app.use(cookieParser());
const exphbs = require('express-handlebars');
const hbs = exphbs.create({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutDir: [
        __dirname + 'resources/views/layouts',
        __dirname + 'resources/views/admin/adminPartials',
    ],
    helpers: {
        sum(a, b) {
            return a + b;
        },
        compare(a,b){
            if(a==b){
                return `<li><a href="/admin">Admin page</a></li>`;
            }else{
                return null
            }
        },
        mul(a, b) {
            return a * b;
        },
        sortable(field, sort) {
            const icons = {
                default: 'fa-solid fa-sort',
                asc: 'fa-solid fa-arrow-up-short-wide',
                desc: 'fa-solid fa-arrow-down-wide-short',
            };
            const types = {
                default: 'desc',
                asc: 'desc',
                desc: 'asc',
            };
            if (field === sort.column) {
                var sortType = sort.type;
            } else {
                sortType = 'default';
            }

            const icon = icons[sortType];
            const type = types[sortType];

            return ` <a class="text-success" href ="?sort&column=${field}&type=${type}"><i class="${icon}"></i></a>`;
        },
    },
});
app.use(passport.initialize());
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.json());
app.use(methodOverride('_method'));
app.use(SortMiddleware);
app.set('views', path.join(__dirname, 'resources', 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(async(req,res,next)=>{
    try{
        const token = req.cookies.jwt;
        if(token){
            const userId = jwt.verify(token,ACCESS_SECRET_TOKEN);
            const userInDB = await UserModel.findById(userId.id);
            req.user = userInDB
            console.log(req.user);
        }else{
            req.user=null
        }
        next()
    }catch(err){
        console.log(err)
    }

})
route(app);
app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});
