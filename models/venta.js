var moment = require('moment');
var mongoose = require('mongoose');
var format = require('format-number');

var Schema = mongoose.Schema;

var DetProducto = new Schema (
  {
    producto: {type: Schema.ObjectId, ref: 'Producto'},
    cantidad: {type: Number},
    importe: {type: Number},
    medias: {type: Number}}
);

DetProducto
.virtual('importe_formateado')
.get(function () {
  return this.importe ? format({prefix:'$'})(Number(this.importe).toFixed(2)) : '0';
});


var VentaSchema = new Schema(
  {
    secuencia: {type: Number, required: true},
    fecha: {type: Date, default: Date.now},
    capturista: {type: String, default: ''},
    total: {type: Number, default: 0},
    subtotal: {type: Number, default: 0},
    descuento: {type: Number, default: 0},
    no_piezas: {type: Number, default: 0},
    no_medias: {type: Number, default: 0},
    productos: [DetProducto]
  }
);

VentaSchema
.virtual('url')
.get(function () {
  return '/venta/' + this._id;
});

VentaSchema
.virtual('fecha_formateada')
.get(function () {
  return this.fecha ? moment(this.fecha).format('DD/MM/YYYY') : '';
});

VentaSchema
.virtual('total_formateado')
.get(function () {
  return this.total ? format({prefix:'$'})(Number(this.total).toFixed(2)) : '0';
});

VentaSchema
.virtual('subtotal_formateado')
.get(function () {
  return this.subtotal ? format({prefix:'$'})(Number(this.subtotal).toFixed(2)) : '0';
});

VentaSchema
.virtual('descuento_formateado')
.get(function () {
  return this.descuento ? format({prefix:'$'})(Number(this.descuento).toFixed(2)) : '0';
});


//Export model
module.exports = mongoose.model('Venta', VentaSchema);
