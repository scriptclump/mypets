module.exports = function (app) {
    app.use('/user',require('../v1/api/userRoutes'));
};
