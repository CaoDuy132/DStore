module.exports = function SortMiddleware(req, res, next) {
    res.locals.sort = false;
    res.locals.type = 'default';
    if (req.query.hasOwnProperty('sort')) {
        res.locals.sort = true;
        res.locals.type = req.query.type;
        res.locals.column = req.query.column;
    }
    next();
};
