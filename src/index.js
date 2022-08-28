const express = require('express');
require('dotenv').config();
const path = require('path');
const app = express();
const port = 8080;
const route = require('./routes');
const db = require('./config/db');
const cookieParser = require('cookie-parser');
//method override restAPI
var methodOverride = require('method-override');
//connect Middleware
const SortMiddleware = require('./app/middlewares/SortMiddleware');
//connect db to expressdb
const hbsHelpers = require('./helpers/index')
console.log(hbsHelpers)
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
app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));
// Middleware to expose the app's shared templates to the cliet-side of the app
//custom middleware
app.use(SortMiddleware);
app.set('views', path.join(__dirname, 'resources', 'views'));
// console.log('PATH: ', path.join(__dirname, 'resources/views'))
app.use(express.static(path.join(__dirname, 'public')));
//HTTP logger
// app.use(morgan('combined'));
route(app);
app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
