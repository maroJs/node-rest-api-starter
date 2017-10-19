  var User = require('../models/user'),
    Q = require('q');
  base = require('./base');

exports.post = function(req, res, next) {
  base.post(req,res,User)
};

exports.get = function(req, res, next) {
  var id = req.params ?  req.params.id: null;
  base.get(req,res,User,id)
};

  exports.find = function(req, res, next) {
    var promise = User.findOne(req.body).exec();
    return promise;
  };


exports.login  = function (userIn){
  deferred = Q.defer();
    var promise = User.findOne({ username: userIn.username }).exec();
    promise.then(function(user) {
      if(user){
        // test a matching password
        if(user.comparePassword(userIn.password)){
          deferred.resolve(user);
          return user;
        }else{
          deferred.reject(false);
          return null;
        }
      }
      else{
        deferred.reject(false);
        return null;
      }

    }).catch(function(err){
      deferred.reject(err);
      return err;
    });

  return deferred.promise;
};


exports.update = function(req, res, next) {
  var id = req.params ?  req.params.id: null;
  base.update(req,res,User,id)
};

exports.delete = function(req, res, next) {
  var id = req.params ?  req.params.id: null;
  base.delete(req,res,User,id)
};
