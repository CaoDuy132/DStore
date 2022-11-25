const express = require('express');
require('dotenv').config();
const path = require('path');
const app = express();
const { PORT } = process.env;
const route = require('./routes');
const db = require('./config/db');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
//method override restAPI
var methodOverride = require('method-override');
//connect Middleware
const SortMiddleware = require('./app/middlewares/SortMiddleware');
//connect db to expressdb
const passport = require('passport');
db.connect();
app.use(cookieParser());
const exphbs = require('express-handlebars');
const UserModel = require('./app/models/User');
const { mongooseToObject } = require('./util/mongoose');
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
        compare(a){
          if(a!=null){
            return a
          }else{
            return a=null
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
// Middleware to expose the app's shared templates to the cliet-side of the app
//custom middleware
app.use(SortMiddleware);
app.set('views', path.join(__dirname, 'resources', 'views'));
// console.log('PATH: ', path.join(__dirname, 'resources/views'))
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
    UserModel.findById('63808127e5c0de0b21ddb94f')
        .then((userInDB) => {
            req.user = userInDB;
            next();
        })
        .catch((err) => console.log(err));
});
route(app);
app.listen(PORT, () => {
    console.log(`Example app listening at http://localhost:${PORT}`);
});
