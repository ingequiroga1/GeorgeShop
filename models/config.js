var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ConfigSchema = new Schema(
  {
    password: {type: String},
    nombreEmpresa: {type: String},
    dias_activos: {type: Number}
  }
);

//Export model
module.exports = mongoose.model('Config', ConfigSchema);
