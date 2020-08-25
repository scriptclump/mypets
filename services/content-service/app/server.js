"use strict";

require('dotenv').config();
var chalk = require('chalk');
var figlet = require('figlet');


var bodyParser = require('body-parser');
var multer = require('multer');

var express = require('express');
var env = process.env.NODE_ENV = process.env.NODE_ENV || 'development';
var app = express();
//var config = require('./config/config')[env];
var methodOverride = require('method-override');

const express = require('express');
const schema = require('./schema');
const cors = require('cors');


const upload = multer({});
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(upload.fields([{name: 'img'}]));

require('./config/express')(app);

require('./config/api')(app);
require('./config/routes')(app);




const { ApolloServer } = require('apollo-server-express');
const url = "mongodb://localhost:27017/contentDb";
const connect = mongoose.connect(url, { useNewUrlParser: true });
connect.then((db) => {
      console.log('Connected correctly to database server!');
}, (err) => {
      console.log(err);
});
const server = new ApolloServer({
      typeDefs: schema.typeDefs,
      resolvers: schema.resolvers
});
const app = express();
var port = process.env.PORT || 1010;
app.use(bodyParser.json());
app.use('*', cors());
server.applyMiddleware({ app });
app.listen({ port: port }, () =>
  console.log(chalk.blue.bold(figlet.textSync(`🚀 Server ready at http://localhost:4000${server.graphqlPath}`))));

