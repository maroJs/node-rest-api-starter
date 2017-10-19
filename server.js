var restify = require('restify')
, fs = require('fs');
require('dotenv').config();

var mongoose = require("mongoose");
var multer = require('multer');


// CONNECT  TO MONGODB (you have to set environement variable MONGODB_URI)
mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI, {useMongoClient:true});
// CONNECTION EVENTS
// When successfully connected
mongoose.connection.on('connected', function () {
  console.log('Mongoose default connection open to  mongodb' );
});

// If the connection throws an error
mongoose.connection.on('error',function (err) {
  console.log('Mongoose default connection error: ' + err);
});


// import the controller module
var controllers = {}
  , controllers_path = process.cwd() + '/app/controllers';
fs.readdirSync(controllers_path).forEach(function (file) {
  if (file.indexOf('.js') != -1) {
    controllers[file.split('.')[0]] = require(controllers_path + '/' + file)
  }
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

// Then set that token in the headers to access routes requiring authorization:
// Authorization: Bearer <token here>
server.get('/api', function(req, res) {
  return res.json({
    status: 'ok',
    resources: [
      {name: 'user', url: '/user', access:'private'},
      {name: 'article', url: '/article', access:'private'},
      {name: 'api', url: '/api', access:'public'},
      {name: 'login', url: '/login', access:'public'}
    ]
  }); // you can add other info about the api here :)
});


// all the API route  are here !!!!

// Article Start CRUD
server.post("/article", controllers.article.post);
server.put("/article/:id", controllers.article.update);
server.post("/article/delete/:id", controllers.article.delete);
server.get("/article", controllers.article.get);
server.get("/article/:id", controllers.article.get);
// Article End

// user Start CRUD
server.post("/user", controllers.user.post);
server.put("/user/:id", controllers.user.update);
server.post("/user/delete/:id", controllers.user.delete);
server.get("/user", controllers.user.get);
server.get("/user/:id", controllers.user.get);
// user End


// HERE YOU CAN ADD OTHER RESSOURCES

// Error handler middleware
server.use(function(err, req, res, next) {
  console.error(err);
  return res.status(500).json({ status: 'error', code: 'unauthorized' });
});


var port = process.env.PORT || 8082;
server.listen(port, function (err) {
  if (err)
    console.error(err);
  else
    console.log('App is ready at : ' + port)
});

if (process.env.environment == 'production')
  process.on('uncaughtException', function (err) {
    console.error(JSON.parse(JSON.stringify(err, ['stack', 'message', 'inner'], 2)))
  });
