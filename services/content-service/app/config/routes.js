module.exports = function (app) {
    
    app.get('*', function (req, res) {
       
    });
    app.use(function (req, res, next) {
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
    });
}