const express = require('express');
const route = express.Router();

const searchController = require('../app/controllers/SearchController');
route.get('/:baiviet', searchController.show);
route.get('/', searchController.index);
module.exports = route;
