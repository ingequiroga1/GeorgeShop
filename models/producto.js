var mongoose = require('mongoose');
var format = require('format-number');

var Schema = mongoose.Schema;

var ProductoSchema = new Schema(
  {
/*    articulo: {type: String, required: true, max: 100},*/
    articulo: {type: Number},
    descripcion: {type: String, required: true, max: 100},
    precio: {type: Number},
    linea: {type: String, required: false},
  }
);

ProductoSchema
.virtual('url')
.get(function () {
  return '/producto/' + this._id;
});

ProductoSchema
.virtual('precio_formateado')
.get(function () {
  return this.precio ? format({prefix:'$'})(Number(this.precio).toFixed(2)) : '0';
});

ProductoSchema
.virtual('descripcion_art')
.get(function () {
  return '@' + this.articulo + '|'+this.descripcion;
});

ProductoSchema
.virtual('descripcion_precio')
.get(function () {
  return '@' + this.articulo + '|' + this.descripcion + '     :' + this.precio_formateado;
});

//Export model
module.exports = mongoose.model('Producto', ProductoSchema);
