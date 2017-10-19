var mongoose = require("mongoose");
var Schema   = mongoose.Schema;


var ArticleSchema = new Schema({
  title: {type:String,unique:true},
  image: String,
  description: String,
  code: String
},{timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }});

// the schema is useless so far
// we need to create a model using it
var Article = mongoose.model('Article', ArticleSchema);

// make this available to our users in our Node applications
module.exports = Article;
