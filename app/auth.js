module.exports = function (server) {
  var ejwt           = require('restify-jwt'),
    jwt            = require('jsonwebtoken'),
    passport       = require('passport'),
    LocalStrategy  = require('passport-local').Strategy,
    moment = require('moment');
  var lodash = require('lodash');

  const log = require('simple-node-logger').createSimpleLogger('./log/server.log');


  function logRequstData(req) {
    log.info('--'+ new Date().toJSON() +' start request --------- Method:',req.method,' URL: ', req.url,' BODY:',JSON.stringify(req.body));
  }

  function logResponseData(res) {
    if(res.status !== 200) {
      log.warn('--'+ new Date().toJSON() +' Response ERROR ---------  BODY:',JSON.stringify(res));
    }else {
      log.info('--'+ new Date().toJSON() +' Response ---------------  BODY:',JSON.stringify(res));
    }
  }

  User = require('./controllers/user');

  var secret = 'super secret';  // set this variable as  env variable for secure reason

  passport.use(new LocalStrategy(function(username, password, cb) {
    User.login({username:username,password:password}).then(function(user){
      if (user) {
        return cb(null, user);
      } else {
        return cb(null, false);
      }
    }).catch(function(err){
      return cb(null, false);
    });

  }));
  var exposedUrl = [new RegExp('/login'), new RegExp('/api')]; // add the resource that you want to access without token eg: '/article' or
  var customApi = require('../myjson');
  if(customApi) {
    lodash.forEach(customApi.data,function (item) {
      if(item.access === 'public') {
        exposedUrl.push(new RegExp('^'+item.url+'*'));
      }
    });
  }
  server.use(passport.initialize());
  server.use(ejwt({secret: secret, userProperty: 'tokenPayload'}).unless({path: exposedUrl }));

// passport authentication

// First login to receive a token
  server.post('/login', function(req, res, next) {
    passport.authenticate('local', function(err, user, info) {
      if (err) return next(err);
      if (!user) {
        res.status(401);
        return res.json({ status: 401, code: 'unauthorized' });
      } else {
        var expires = moment().add(1, 'hours');
        return res.json({ token: jwt.sign({id: user.id}, secret,{expiresIn:'1h'}), expires:expires.unix() });
      }
    })(req, res, next);
  });


  server.use(function(req, res, next) {

    // log request and response data
    logRequstData(req);
    res.on('finish', function(){
      logResponseData(res._body);
    });

    // test request token
    if (req.tokenPayload) {
      User.find({_id:req.tokenPayload.id}).then(function(user){
        req.user = user;
        return next();
      }).catch(function(err){
        logResponseData({ status: 401, code: 'unauthorized',err:err });
        res.status(401);
        return res.json({ status: 401, code: 'unauthorized',err:err });
      });
    }else{
      var found =lodash.find(exposedUrl, function(value){
        return value.test(req.url);
      });
      if(found){
        return next();
      }else{
        logResponseData({ status: 401, code: 'unauthorized'});
        res.status(401);
        return res.json({ status: 401, code: 'unauthorized'});
      }
    }

  });

  /*server.post('/logout', function(req, res, next) {
    //req.session.destroy();
    req.logout();
    req.session.destroy(function (err) {
      if (err) { return next(err); }
      // The response should indicate that the user is no longer authenticated.
      return res.send({ authenticated: req.isAuthenticated() });
    });
    return res.json({ status: 200});
  });*/

  return server;
};
