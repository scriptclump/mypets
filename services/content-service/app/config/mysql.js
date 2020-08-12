'user strict';

var Sequelize = require('sequelize');
var chalk = require('chalk');
console.log(process.env.DATABASE_HOSTNAME)
var sequelize = new Sequelize(process.env.DATABASE_NAME, process.env.DATABASE_USERNAME, process.env.DATABASE_PASSWORD, {
     host: process.env.DATABASE_HOSTNAME,
     dialect: 'mysql',
     port: 3306,
     logging: false,
     replication: {
          read: [
               //we can have multiple read server  but single write server
               { host: process.env.DATABASE_HOSTNAME, username: process.env.DATABASE_USERNAME, password: process.env.DATABASE_PASSWORD }
          ],
          write: { host: process.env.DATABASE_HOSTNAME, username: process.env.DATABASE_USERNAME, password: process.env.DATABASE_PASSWORD }
     },
     pool: {
          maxConnections: 50,
          maxIdleTime: 30000
     },
     define: {
          timestamps: false
     },
     dialectOptions: {
          multipleStatements: true
     }
});

sequelize.authenticate()
     .then(function () {
          // console.log(chalk.green.bold("==>  Connected with database using Sequalize ORM."));
     })
     .catch(function (err) {
          console.log(chalk.red.bold("==>  There is an error in database connection" , err));
     })
     .done();

module.exports = sequelize;
