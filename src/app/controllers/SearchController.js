const res = require('express/lib/response');

class SearchController {
    index(req, res) {
        res.render('search');
    }
    show(req, res) {
        res.render('baiviet');
    }
}
module.exports = new SearchController();
