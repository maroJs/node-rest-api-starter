
var fs = require('fs');
var lodash = require('lodash');
readline = require('readline');
const log = require('simple-node-logger').createSimpleLogger('./log/api-create.log');


log.info('--', new Date().toJSON() ,'********************************** START API SCRIPT **************************************************');
log.info('--'+ new Date().toJSON() +' Start create API Resources');


String.prototype.capitalizeFirstLetter = function() {
  return this.charAt(0).toUpperCase() + this.slice(1).toLowerCase();
};

function createFieldsObject(field) {
  this[field.title] = {type: field.type,unique:field.unique ? true : false, required: field.required ? true: false}
}

function createModelFile(objectModel) {
  try {
    log.info('--', new Date().toJSON() , ' start read model template for: ', objectModel.name);
    var stream = fs.createWriteStream(process.cwd() + '/app/models/'+ objectModel.name + '.js');
    var file = fs.createReadStream(process.cwd() + '/app/model.template.txt');
    var rd = readline.createInterface({
      input: file
    });

    stream.on('error', function(err) {
      log.warn('--', new Date().toJSON() , ' error when open template file: ', objectModel.name);
      log.warn(err);
    });

    file.on('error', function(err) {
      log.warn('--', new Date().toJSON() , ' error when create model file: ', objectModel.name);
      log.warn(err);
    });

    var lines = [];
    rd.on('line', function(line) {
      lines.push(line);
    });
    rd.on('close', function(){
      var i = 0;
      log.info('--', new Date().toJSON() , ' start create model file:', objectModel.name);
      lodash.forEach(lines, function(line){
        line = line.replace('{$nameUpper}',objectModel.name.capitalizeFirstLetter());
        var fields={};
        lodash.forEach(objectModel.fields, createFieldsObject.bind(fields));
        fields = JSON.stringify(fields);
        if(fields) {
          fields = fields.replace('"string"',"String");
          fields = fields.replace('"number"',"Number");
          fields = fields.replace('"date"',"Date");
        }
        line = line.replace('{$$param}',fields);
        stream.write(line + '\n');
        i++;
        if(i===lines.length){
          stream.end();
          log.info('--', new Date().toJSON() , ' end create model file: ' , objectModel.name);
        }
      });
    });
  } catch(ex) {
    log.warn('--', new Date().toJSON() , ' error when create model file: ', objectModel.name);
  }

}

function createControllerFile(objectModel) {
  try {
    log.info('--', new Date().toJSON() , ' start read controller template for: ',objectModel.name);
    var stream = fs.createWriteStream(process.cwd() + '/app/controllers/'+ objectModel.name + '.js');
    var file = fs.createReadStream(process.cwd() + '/app/controller.template.txt');
    var rd = readline.createInterface({
      input: file
    });

    stream.on('error', function(err) {
      log.warn('--', new Date().toJSON() , ' error when open  ', objectModel.name, ' controller template file: ', objectModel.name);
      log.warn(err);
    });

    file.on('error', function(err) {
      log.warn('--', new Date().toJSON() , ' error when create  ', objectModel.name, ' controller file: ', objectModel.name);
      log.warn(err);
    });

    var lines = [];
    rd.on('line', function(line) {
      lines.push(line);
    });
    rd.on('close', function(){
      var i = 0;
      log.info('--', new Date().toJSON() , ' start write controller file for: ', objectModel.name);
      lodash.forEach(lines, function(line){
        line = line.replace('{$name}',objectModel.name);
        stream.write(line + '\n');
        i++;
        if(i===lines.length){
          stream.end();
          log.info('--', new Date().toJSON() , ' end write controller file for: ', objectModel.name);
        }
      });
    });
  }catch(ex) {
    log.warn('--', new Date().toJSON() , ' error when create controller file: ', objectModel.name);
  }
}

function main() {
  fs.readFile('myjson.json', 'utf8', function readFileCallback(err, data){
    if (err){
      log.warn('--', new Date().toJSON() , ' error to open json file');
    } else {
      customApiJson = JSON.parse(data); //now it an object
      var i = 0;
      lodash.forEach(customApiJson.data,function(item){
        if(item.autoCreate) {
          createModelFile(item);
          createControllerFile(item);
          i++;
        }
        item.autoCreate = false;
      });
      json = JSON.stringify(customApiJson); //convert it back to json
      fs.writeFile('myjson.json', json, 'utf8', function () {
        log.info('--', new Date().toJSON() , i , ' resources created');
        log.info('--', new Date().toJSON() , ' write new json file');
        log.info('--', new Date().toJSON() , '*************************** END SCRIPT ************************************');
      }); // write it back
    }});
}

main();

/*



var customApiJson = require('./myjson');

if(customApiJson && customApiJson.data) {

  var json = JSON.stringify(customApiJson);
  fs.writeFile('myjson.json', json, 'utf8', callback);
}
*/
