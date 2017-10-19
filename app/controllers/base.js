var mongoose = require('mongoose'),
  ObjectId = mongoose.Types.ObjectId;


exports.post = function(req, res,model) {
  var objectModel = new model(req.body);
  objectModel.save(function(err, object) {
    if (err) {
      res.status(500);
      res.json({
        status: 500,
        data: err
      })
    } else {
      res.json({
        status: 200,
        data: object
      })
    }
  })
};

exports.get = function(req, res,model,id) {
  if(id){
    model.findById(new ObjectId(id), function(err, object) {
      if (err) {
        res.status(500);
        res.json({
          status: 500,
          data: err
        })
      } else {
        if (object) {
          res.json({
            status: 200,
            data: object
          })
        } else {
          res.status(404);
          res.json({
            status: 404,
            data: "Resource: " + req.params.id + " not found"
          })
        }
      }
    })
  }else{
    model.find({}, function(err, objects) {
      if (err) {
        res.status(500);
        res.json({
          status: 500,
          data: err
        })
      } else {
        if (objects) {
          res.json({
            status: 200,
            data: objects
          })
        } else {
          res.status(404);
          res.json({
            status: 404,
            data: "resources:  not found"
          })
        }
      }
    })
  }

};

exports.update = function(req, res,model,id) {
  model.findByIdAndUpdate(new ObjectId(id), req.body, {new: true}, function(err, object) {
    if (err) {
      res.status(500);
      res.json({
        status: 500,
        data: "Error occured: " + err
      })
    } else {
      if (object) {
        res.json({
          status: 200,
          data: object
        })
      } else {
        res.status(404);
        res.json({
          status: 404,
          data: "Resource: " + id + " not found"
        })
      }
    }
  })
};

exports.delete = function(req, res,model,id) {
  model.findByIdAndRemove(new Object(id), function(err, object) {
    if (err) {
      res.status(500);
      res.json({
        status: 500,
        data: "Error occured: " + err
      })
    } else {
      res.status(200);
      res.json({
        status: 200,
        data: "Resource: " + id + " deleted successfully"
      })
    }
  })
};

exports.getPopulate = function(req, res,model,populate,id) {
  if(id){
    model.findById(new ObjectId(id)).populate(populate).exec( function(err, object) {
      if (err) {
        res.status(500);
        res.json({
          status: 500,
          data: err
        })
      } else {
        if (object) {
          res.json({
            status: 200,
            data: object
          })
        } else {
          res.status(404);
          res.json({
            status: 404,
            data: "Resource: " + req.params.id + " not found"
          })
        }
      }
    })
  }else{
    model.find({}).populate(populate).exec(function(err, objects) {
      if (err) {
        res.status(500);
        res.json({
          status: 500,
          data: err
        })
      } else {
        if (objects) {
          res.json({
            status: 200,
            data: objects
          })
        } else {
          res.status(404);
          res.json({
            status: 404,
            data: "resources:  not found"
          })
        }
      }
    })
  }

};
