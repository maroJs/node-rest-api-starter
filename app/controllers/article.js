var  Article = require('../models/article'),
  base = require('./base');

exports.post = function(req, res, next) {
  base.post(req,res,Article)
};

exports.get = function(req, res, next) {
  var id = req.params ?  req.params.id: null;
  base.get(req,res,Article,id)
};


exports.update = function(req, res, next) {
  var id = req.params ?  req.params.id: null;
  base.update(req,res,Article,id)
};

exports.delete = function(req, res, next) {
  var id = req.params ?  req.params.id: null;
  base.delete(req,res,Article,id)
};
