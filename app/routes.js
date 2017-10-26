module.exports = function (server) {
  var fs = require('fs');
  var lodash = require('lodash');
  readline = require('readline');
// import the controller module
  var controllers = {}
    , controllers_path = process.cwd() + '/app/controllers';
  fs.readdirSync(controllers_path).forEach(function (file) {
    if (file.indexOf('.js') != -1) {
      controllers[file.split('.')[0]] = require(controllers_path + '/' + file)
    }
  });



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



  var customApi = require('../myjson');  // get json of custom API auto created

  // init resources
  var resources = [
    {name: 'user', url: '/user', access:'private'},
    {name: 'article', url: '/article', access:'private'},
    {name: 'api', url: '/api', access:'public'},
    {name: 'login', url: '/login', access:'public'}
  ];

  // create custom api routes
  if(customApi) {
    lodash.forEach(customApi.data,function (item) {
      if(controllers[item.name]) {
        resources.push({name: item.name, url: item.url, access: item.access});
        if (item.methods.indexOf('get') !== -1) {
          server.get(item.url, controllers[item.name].get);
          server.get(item.url + '/:id', controllers[item.name].get);
        }
        if (item.methods.indexOf('post') !== -1) {
          server.post(item.url, controllers[item.name].post);
        }
        if (item.methods.indexOf('delete') !== -1) {
          server.post(item.url + '/delete/:id', controllers[item.name].post);
        }
        if (item.methods.indexOf('put') !== -1) {
          server.put(item.url + '/:id', controllers[item.name].update);
        }
    }
    })
  }

  // Then set that token in the headers to access routes requiring authorization:
// Authorization: Bearer <token here>
  server.get('/api', function(req, res) {
    return res.json({
      status: 'ok',
      resources: resources
    }); // you can add other info about the api here :)
  });

return server;
};
