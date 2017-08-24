const createError = require('http-errors');

module.exports = function (req, res, next) {
    if (!req.session.userName)
        return next(createError(401, 'Please login to view this page.'));
    next();
};