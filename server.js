var restify = require('restify')
, fs = require('fs');
require('dotenv').config();

var mongoose = require("mongoose");
var multer = require('multer');
const log = require('simple-node-logger').createSimpleLogger('./log/server.log');


// CONNECT  TO MONGODB (you have to set environement variable MONGODB_URI)
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, {useMongoClient:true});
// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
  log.info('--'+ new Date().toJSON() +' Mongoose default connection open to  mongodb');
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
  log.info('--'+ new Date().toJSON() +' Mongoose default connection error: ', err);
});




// Add request header config
function corsHandler(req, res, next) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, X-Response-Time, X-PINGOTHER, X-CSRF-Token,Authorization');
  res.setHeader('Access-Control-Allow-Methods', '*');
  res.setHeader('Access-Control-Expose-Headers', 'X-Api-Version, X-Request-Id, X-Response-Time');
  res.setHeader('Access-Control-Max-Age', '1000');
  return next();
}
// call the request method
function optionsRoute(req, res, next) {
  res.send(200);
  return next();
}

var server = restify.createServer();

server
  .use(restify.fullResponse())
  .use(restify.bodyParser());

server.use(restify.CORS({
  credentials: false,                 // defaults to false
  methods: ['GET','PUT','DELETE','POST','OPTIONS']
}));

server.opts('/\.*/', corsHandler, optionsRoute);

// handle the authentication by token
server  = require('./app/auth.js')(server);

// all the API route  are here !!!!
server  = require('./app/routes.js')(server);

//server  = require('./api.js')(server);


// HERE YOU CAN ADD OTHER RESSOURCES

// #LIST_CUSTOM_API



// Error handler middleware
server.use(function(err, req, res, next) {
  return res.status(500).json({ status: 'error', code: 'unauthorized' });
});


var port = process.env.PORT || 8082;
server.listen(port, function (err) {
  if (err){
    log.info('--'+ new Date().toJSON() +' Run server error: ', err);
  }
  else {
    log.info('--'+ new Date().toJSON() +' App is ready at: ', err);
  }
});

if (process.env.environment == 'production')
  process.on('uncaughtException', function (err) {
    console.error(JSON.parse(JSON.stringify(err, ['stack', 'message', 'inner'], 2)))
  });
