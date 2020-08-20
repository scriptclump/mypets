module.exports = function (app) {
    app.use('/content',require('../v1/api/bannerRoutes'));
};
