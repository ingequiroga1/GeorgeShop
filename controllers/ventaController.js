const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var Venta = require('../models/venta');
var Producto = require('../models/producto');
const PDFDocument = require('pdfkit');
const NumeroALetras = require('../helpers/numtoletras');

var async = require('async');

// Muestra lista de las Ventas.
exports.venta_list = function(req, res, next) {
  Venta.find({})
    .exec(function (err, list_ventas) {
      if (err) { return next(err); }
      if (list_ventas.length > 0) {
          //Successful, so render
      res.render('venta_list', { title: 'Lista de Ventas', venta_list: list_ventas });
      } else {
        let listavacia = [
            {
                "secuencia": "No hay Ventas",
                "fecha_formateada": "",
                "no_piezas": "",
                "no_medias": "",
                "total_formateado":"",
                "capturista":""
            }
        ]

        res.render('venta_list', { title: 'Lista de Ventas', venta_list: listavacia });
      }
    });  
};

//Api
// Muestra lista de las Ventas.
exports.venta_api_list = function(req, res, next) {
    Venta.find({})
      .exec(function (err, list_ventas) {
        if (err) { return err; }
        if (list_ventas.length > 0) {
            //Successful, so render
        res.json(list_ventas);
        } else {
          let listavacia = [
              {
                  "secuencia": "No hay Ventas",
                  "fecha_formateada": "",
                  "no_piezas": "",
                  "no_medias": "",
                  "total_formateado":"",
                  "capturista":""
              }
          ]
  
          res.json(listavacia);
        }
      });  
  };



// Carga catalogo de productos de prueba
exports.venta_carga_productos = function (req, res, next) {

  productos = [{articulo: '2001', descripcion: 'TENIS. NUM 22:25. MOD400', precio: 101.90, linea: ''},
  {articulo: '2002', descripcion: 'TENIS. NUM 22:25. MOD600', precio: 111.50, linea: ''},
  {articulo: '2003', descripcion: 'TENIS. NUM 22:25. MOD800', precio: 121.50, linea: ''},
  {articulo: '2004', descripcion: 'TENIS. NUM 22:25. MOD1000', precio: 131.40, linea: ''},
  {articulo: '2005', descripcion: 'TENIS. NUM 18:25. MOD400', precio: 141.30, linea: ''},
  {articulo: '2006', descripcion: 'TENIS. NUM 18:25. MOD800', precio: 151.20, linea: ''},
  {articulo: '2007', descripcion: 'TENIS. NUM 18:25. MOD600', precio: 161.10, linea: ''},
  {articulo: '2008', descripcion: 'TENIS. NUM 18:25. MOD1000', precio: 171.50, linea: ''},
  {articulo: '2009', descripcion: 'BELINDA. NUM 22:25. MOD1600', precio: 181.30, linea: ''},
  {articulo: '2010', descripcion: 'BELINDA. NUM 22:25. MOD1200', precio: 191.70, linea: ''},
  {articulo: '2011', descripcion: 'BELINDA. NUM 22:25. MOD1500', precio: 201.20, linea: ''},
];

  Producto.collection.insert(productos, function (err, result) { 
    if (err) { return console.log(err);}
    else {
      console.log(result);
    }
  });

}

// Muestra detalle de venta.
exports.venta_detail = function(req, res, next) {

    async.parallel({
        venta: function(callback) {

            Venta.findById(req.params.id)
              .populate('productos.producto')
              .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        console.log(results.venta);
        if (results.venta==null) { // No results.
            var err = new Error('Venta not found');
            err.status = 404;
            return next(err);
        }
        //if (results.venta.length > 0) {
            res.render('venta_detail', { title: 'Detalle', venta: results.venta } );
    });

};

//API
exports.venta_api_detail = function(req, res, next) {

    async.parallel({
        venta: function(callback) {

            Venta.findById(req.params.id)
              .populate('productos.producto')
              .exec(callback);
        },
    }, function(err, results) {
        if (err) {  res.json(err); }
        if (results.venta==null) { // No results.
            var err = new Error('Venta not found');
            err.status = 404;
            res.json(err);
        }
        //if (results.venta.length > 0) {
            res.json(results.venta);
    });

};


// Muestra detalle de venta.
exports.venta_imprimir_get = function(req, res, next) {

    Venta.findById(req.params.id)
              .populate('productos.producto')
              .exec(function(err, venta) {
        if (err) { return next(err); }

        if (venta==null) { // No results.
            var err = new Error('Venta not found');
            err.status = 404;
            return next(err);
        }

        
        const doc = new PDFDocument();
        let filename = 'venta';
        // Stripping special characters
        filename = encodeURIComponent(filename) + '.pdf'
        // Setting response to 'attachment' (download).
        // If you use 'inline' here it will automatically open the PDF
        res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"')

        res.setHeader('Content-type', 'application/pdf')
        //const content = req.body.content
        doc.y = 30
        var alturafila = 30;
        doc.text('Presupuesto', 400, alturafila);
        alturafila += 20;
        doc.text('Cliente: ', 30, alturafila);
        doc.text(venta.capturista, 80, alturafila);
        doc.text('Fecha: ', 400, alturafila);
        doc.text(venta.fecha_formateada, 450, alturafila);
        alturafila += 50;
        doc.moveTo(30, alturafila);
        doc.lineTo(570,alturafila);
        doc.stroke();

        alturafila += 10;
        doc.text('#Piezas  #Medias     Detalle', 30, alturafila);
        doc.text('Importe', 500, alturafila, {width:'70', align:'right'});
        doc.text('Precio', 450, alturafila, {width:'70', align:'left'});

 
        alturafila += 20;
        doc.moveTo(30, alturafila);
        doc.lineTo(570,alturafila);
        doc.stroke();
        alturafila += 10;

        venta.productos.forEach(producto => {
            doc.text(producto.cantidad,35, alturafila, {width:'25', align:'right'});
            doc.text(producto.medias,75, alturafila, {width:'25', align:'right'});
            doc.fontSize(9);
            doc.text(producto.producto.descripcion,130, alturafila, {width:'280', align:'left'});
            doc.fontSize(11);
            doc.text(producto.producto.precio_formateado,430, alturafila, {width:'50', align:'right'});
            doc.text(producto.importe_formateado,500, alturafila, {width:'70', align:'right'});            
            alturafila += 20;
        });

        if (alturafila >= 620) {
            doc.addPage();
            alturafila = 30;
            console.log('newpage');
            
        }
        else{
            alturafila = 620;
        }

        doc.fontSize(16);
       //alturafila = 640;
       doc.text('Total Piezas:', 30, alturafila);
       doc.text(venta.no_piezas, 110, alturafila, {width:'40', align:'right'});
       doc.text('Subtotal:', 280, alturafila, {width:'200', align:'right'});
       doc.text(venta.subtotal_formateado, 470, alturafila, {width:'100', align:'right'});    
       alturafila += 20;
       doc.text('Total Medias:', 30, alturafila);
       doc.text(venta.no_medias, 110, alturafila, {width:'40', align:'right'});
       doc.text('Descuento/Devolucion:', 280, alturafila, {width:'200', align:'right'});
       doc.text(venta.descuento_formateado, 470, alturafila, {width:'100', align:'right'});
       alturafila += 20;
       doc.text('Total:', 280, alturafila, {width:'200', align:'right'});
       doc.text(venta.total_formateado, 470, alturafila, {width:'100', align:'right'});
       
       var letras = NumeroALetras.NumeroALetras(venta.total);

       alturafila += 25;
       doc.fontSize(9);
       doc.text(letras, 50, alturafila);

       //alturafila += 25;
       let avisoEncabezado = 'Política Devolución:';
       
       let aviso = 'El plazo para devolución del producto deberá hacerse en el término de 90 días a partir de la compra, siempre y cuando lo haga en su '; 
       let aviso2 = 'empaque original. No aplica devoluciones en pares desiguales manchados, ni mal tratados la garantía, solo aplica, en defectos de fabricación,'; 
       let aviso3 = 'y|o cuando el uso sea adecuado y presenten alguna falla. No hay garantía, en aplicaciones, ni en sistemas de luces led.'; 
      
       let aviso4 = 'DEVOLUCIONES SOLO APLICAN POR DEFECTO DE FABRICACIÓN Y EN SU EMPAQUE ORIGINAL';
       doc.text(avisoEncabezado, 20, doc.page.height - 80, {
        lineBreak: false
      });
      doc.text(aviso, 20, doc.page.height - 70, {
        lineBreak: false
      });
    //   doc.text(aviso4, 20, doc.page.height - 70, {
    //     lineBreak: false
    //   });
      doc.text(aviso2, 20, doc.page.height - 60, {
        lineBreak: false
      });
      doc.text(aviso3, 20, doc.page.height - 50, {
        lineBreak: false
      });


    
    doc.pipe(res);
    doc.end();

    });

};

exports.venta_eliminar_get = function(req, res, next) {
    
    Venta.findById(req.params.id)
        .populate('productos.producto')
        .exec(function(err, venta) {
        if (err) { return next(err); }

        if (venta==null) { // No results.
            var err = new Error('Venta not found');
            err.status = 404;
            return next(err);
        }
        console.log("eliminar get req",req);

        res.render('venta_detail', { title: 'Detalle', tipo:"eliminar", venta: venta } );
    });

};

exports.venta_eliminar_post = function(req, res, next) {
    
    Venta.findByIdAndRemove(req.body.idventa, function deleteVenta(err) {
        if (err) { return next(err); }
        console.log("eliminar post req",req);
        res.redirect('/venta/lista');
        
    })

};

exports.venta_eliminar_anterior = function(dias) {
    var fecha = new Date();
    var Anterior = new Date(fecha.getTime() - 24*60*60*1000*dias);
    Venta.remove({fecha:{$lt: Anterior}}, function deleteVenta(err) {
        if (err) { return err; }
        console.log('Eliminando ventas anteriores a: ' + Anterior);
        return 1;
    });
    
};

exports.venta_capturista_post = function(req, res, next) {
    var id = req.params.id;
    var capturista = req.body.capturista;

    Venta.updateOne({_id: id}, { $set: {capturista: capturista}}, function (err) {
        if (err) { return next(err); }
        
        async.parallel({
            venta: function(callback) {
    
                Venta.findById(id)
                  .populate('productos.producto')
                  .exec(callback);
            },
        }, function(err, results) {
            if (err) { return next(err); }
    
            if (results.venta==null) { // No results.
                var err = new Error('Venta not found');
                err.status = 404;
                return next(err);
            }
            res.redirect(results.venta.url);//, { title: 'Detalle', venta: results.venta } );
        });
    });

};

//API VQUIROGA

exports.venta_api_capturista_post = function(req, res, next) {
    var id = req.params.id;
    var capturista = req.body.capturista;

    Venta.updateOne({_id: id}, { $set: {capturista: capturista}}, function (err) {
        if (err) { res.json(err); }
        
        async.parallel({
            venta: function(callback) {
    
                Venta.findById(id)
                  .populate('productos.producto')
                  .exec(callback);
            },
        }, function(err, results) {
            if (err) { res.json(err); }
    
            if (results.venta==null) { // No results.
                var err = new Error('Venta not found');
                err.status = 404;
                return next(err);
            }
            res.json(results);//, { title: 'Detalle', venta: results.venta } );
        });
    });

};

exports.venta_descuento_post = function(req, res, next) {
    var id = req.params.id;
    var descuento = req.body.descuento; 
    Venta.findById(id).exec(function (err, venta) {
        if (venta==null) { // No results.
            var err = new Error('Venta no encontrada');
            err.status = 404;
            return next(err);
        }
        var total = venta.subtotal - descuento;
        Venta.updateOne({_id: id}, { $set: {descuento: descuento, total: total}}, function (err) {
            if (err) { return next(err); }

            res.redirect(venta.url);
        });
        console.log("aplica descuento total:",total);
    });
};

exports.venta_agregar_producto_get = function(req, res, next) {

    async.parallel({
        venta: function(callback) {

            Venta.findById(req.params.id)
              .populate('productos.producto')
              .exec(callback);
        },
        productos: function(callback) {

            Producto.find()
              .exec(callback);
        }, 
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.venta==null) { // No results.
            var err = [{msg:'Venta no encontrada'}];
            err.status = 404;
            return next(err);
        }
        // Successful, so render.
        res.render('venta_producto_form', { title: 'Agregar Producto', tipo:'agregar', venta: results.venta } );
    });

};

exports.venta_agregar_producto_post = [
    body('cantidad', 'Cantidad requerida').isNumeric({gt:0}),
    body('prodescripcion', 'Producto requerido').isLength({min:1}).trim(),

    sanitizeBody('cantidad').trim().escape(),
    sanitizeBody('prodescripcion').trim().escape(),

    (req, res, next) => {
        var id = req.params.id;
        const errors = validationResult(req);

        Venta.findById(id)
            .populate('productos.producto')
            .exec(function (err, venta) {
            if (err) { return next(err);}
            var tmpDescripcion = req.body.prodescripcion;
            var letraInicio = tmpDescripcion.substring(0,1);
            var iniciodes = tmpDescripcion.indexOf('|');
            if (iniciodes < 0) {
                iniciodes = tmpDescripcion.length;
            }

            tprodes = req.body.prodescripcion.substring(iniciodes+1);
            tarticulo = req.body.prodescripcion.substring(1, iniciodes);

            if ((letraInicio=='A' || letraInicio=='@') && !isNaN(tarticulo)) {
                //Producto.findById(req.body.producto).exec(function (err, pro) {
                Producto.findOne({articulo: tarticulo}).exec(function (err, pro) {
                    if (err) { console.log(err); return next(err);}
                                    
                    if (!pro ){
                        var err = [{msg:'Producto No existe'}];
                        res.render('venta_detail', { title: 'Detalle', venta: venta, producto: producto, errors: err, prodes:tmpDescripcion } );
                    }
                    else {
                        var producto = {
                            producto: pro._id,
                            cantidad: Math.round(req.body.cantidad),
                            importe: Math.round(req.body.cantidad * pro.precio*100)/100, 
                            medias: Math.round(req.body.cantidad / 6)
                        };
                        
                        if (!errors.isEmpty()) {                        
                            if (venta==null) { // No results.
                                var err = new Error('Venta no encontrada');
                                
                                err.status = 404;
                                return next(err);
                            }
                            // Successful, so render.
                            res.render('venta_detail', { title: 'Detalle', venta: venta, producto: producto, errors:err, prodes:tmpDescripcion } );
                        return;
                        }
                        else {
                            // Data from form is valid.
                            // Check if Genre with same name already exists.
                            Venta.find({ '_id': req.params.id}, {'productos': {$elemMatch:{'producto': producto.producto}} })
                                .exec( function(err, producto_encontrado) {
                                    if (err) { return next(err); }
                                     
                                    if (producto_encontrado[0].productos[0]) {
                                        var ventaProducto = producto_encontrado[0].productos[0];
                                        var sumacantidad = producto.cantidad+ventaProducto.cantidad;
                                        var mensajeError='Ya existe el producto en la venta se agregan ' + producto.cantidad + ' piezas. Total: ' + sumacantidad;
                                        var errEncontrado = [{msg: mensajeError}];
                                        
                                        var venta_subtotal = venta.subtotal + producto.importe; 
                                        var venta_total = venta_subtotal - venta.descuento;
                                        var venta_no_medias = venta.no_medias + producto.medias; 
                                        var venta_no_piezas = venta.no_piezas + producto.cantidad;
                                        
                                        producto.cantidad = producto.cantidad+ventaProducto.cantidad;
                                        producto.importe = producto.importe+ventaProducto.importe;
                                        producto.medias = producto.medias+ventaProducto.medias;
                                        
                                        Venta.updateOne({_id: venta.id, 'productos.producto': producto.producto}, {$set: {total: venta_total, subtotal: venta_subtotal, no_piezas: venta_no_piezas, no_medias: venta_no_medias, 'productos.$.cantidad': producto.cantidad, 'productos.$.importe': producto.importe, 'productos.$.medias': producto.medias }}, function (err) {
                                        if (err) { return next(err); }
                                        // Genre saved. Redirect to genre detail page.
                                        Venta.findById(id)
                                            .populate('productos.producto')
                                            .exec(function (err, venta) {
                                            if (err) { return next(err);}

                                            res.render('venta_detail', { title: 'Detalle', venta: venta, errors: errEncontrado, prodescripcion:'' } );
                                            });
                                        });



                                    }
                                    else {
                                        var venta_subtotal = venta.subtotal + producto.importe;
                                        var venta_total = venta_subtotal - venta.descuento
                                        var venta_no_medias = venta.no_medias + producto.medias;
                                        var venta_no_piezas = venta.no_piezas + producto.cantidad;
                                        
                                        Venta.updateOne({_id: id}, { $push: {productos: producto}, $set: {total: venta_total, subtotal: venta_subtotal, no_piezas: venta_no_piezas, no_medias: venta_no_medias}}, function (err) {
                                        if (err) { return next(err); }
                                        // Genre saved. Redirect to genre detail page.
                                        res.redirect(venta.url);
                                        });

                                    }
                                });
                        }
                    }
                });
            }
            else {
                var err = [{msg:'Producto No existe'}];
                res.render('venta_detail', { title: 'Detalle', venta: venta, errors: err, prodes:tmpDescripcion } );
            }
        });
    }
];

//API VQuiroga
exports.venta_agregar_producto_api_post = [
    body('cantidad', 'Cantidad requerida').isNumeric({gt:0}),
    body('prodescripcion', 'Producto requerido').isLength({min:1}).trim(),

    sanitizeBody('cantidad').trim().escape(),
    sanitizeBody('prodescripcion').trim().escape(),

    (req, res) => {
        var id = req.params.id;
        const errors = validationResult(req);


        Venta.findById(id)
            .populate('productos.producto')
            .exec(function (err, venta) {
            if (err) { res.json(err);}
            var tmpDescripcion = req.body.prodescripcion;
            var letraInicio = tmpDescripcion.substring(0,1);
            var iniciodes = tmpDescripcion.indexOf('|');
            if (iniciodes < 0) {
                iniciodes = tmpDescripcion.length;
            }

            tprodes = req.body.prodescripcion.substring(iniciodes+1);
            tarticulo = req.body.prodescripcion.substring(1, iniciodes);

            if ((letraInicio=='A' || letraInicio=='@') && !isNaN(tarticulo)) {
                //Producto.findById(req.body.producto).exec(function (err, pro) {
                Producto.findOne({articulo: tarticulo}).exec(function (err, pro) {
                    if (err) { console.log(err); res.json(err);}
                                    
                    if (!pro ){
                        var err = [{msg:'Producto No existe'}];
                        res.json({ title: 'Detalle', venta: venta, producto: producto, errors: err, prodes:tmpDescripcion } );
                    }
                    else {
                        var producto = {
                            producto: pro._id,
                            cantidad: Math.round(req.body.cantidad),
                            importe: Math.round(req.body.cantidad * pro.precio*100)/100, 
                            medias: Math.round(req.body.cantidad / 6)
                        };
                        
                        if (!errors.isEmpty()) {  
                                              
                            if (venta==null) { // No results.
                                var err = new Error('Venta no encontrada');
                                
                                err.status = 404;
                                res.json(err);
                            }
                            // Successful, so render.
                            res.json({ title: 'Detalle', venta: venta, producto: producto, errors:err, prodes:tmpDescripcion } );
                        return;
                        }
                        else {
                           
                            // Data from form is valid.
                            // Check if Genre with same name already exists.
                            Venta.find({ '_id': req.params.id}, {'productos': {$elemMatch:{'producto': producto.producto}} })
                                .exec( function(err, producto_encontrado) {
                                    if (err) { res.json(err); }
                                
                                    if (producto_encontrado[0].productos[0]) {
                                        var ventaProducto = producto_encontrado[0].productos[0];
                                        var sumacantidad = producto.cantidad+ventaProducto.cantidad;
                                        var mensajeError='Ya existe el producto en la venta se agregan ' + producto.cantidad + ' piezas. Total: ' + sumacantidad;
                                        var errEncontrado = [{msg: mensajeError}];
                                        
                                        var venta_subtotal = venta.subtotal + producto.importe; 
                                        var venta_total = venta_subtotal - venta.descuento;
                                        var venta_no_medias = venta.no_medias + producto.medias; 
                                        var venta_no_piezas = venta.no_piezas + producto.cantidad;
                                        
                                        producto.cantidad = producto.cantidad+ventaProducto.cantidad;
                                        producto.importe = producto.importe+ventaProducto.importe;
                                        producto.medias = producto.medias+ventaProducto.medias;
                                        
                                        Venta.updateOne({_id: venta.id, 'productos.producto': producto.producto}, {$set: {total: venta_total, subtotal: venta_subtotal, no_piezas: venta_no_piezas, no_medias: venta_no_medias, 'productos.$.cantidad': producto.cantidad, 'productos.$.importe': producto.importe, 'productos.$.medias': producto.medias }}, function (err) {
                                        if (err) { res.json(err); }
                                        // Genre saved. Redirect to genre detail page.
                                        Venta.findById(id)
                                            .populate('productos.producto')
                                            .exec(function (err, venta) {
                                            if (err) { res.json(err);}
                                            res.json({ title: 'Detalle', venta: venta, errors: errEncontrado, prodescripcion:'' });
                                            });
                                        });



                                    }
                                    else {
                                        var venta_subtotal = venta.subtotal + producto.importe;
                                        var venta_total = venta_subtotal - venta.descuento
                                        var venta_no_medias = venta.no_medias + producto.medias;
                                        var venta_no_piezas = venta.no_piezas + producto.cantidad;
                                        
                                        Venta.updateOne({_id: id}, { $push: {productos: producto}, $set: {total: venta_total, subtotal: venta_subtotal, no_piezas: venta_no_piezas, no_medias: venta_no_medias}}, function (err) {
                                        if (err) { res.json(err); }
                                        // Genre saved. Redirect to genre detail page.
                                        res.json(venta);
                                        });

                                    }
                                });
                        }
                    }
                });
            }
            else {
                var err = [{msg:'Producto No existe'}];
                res.json({ title: 'Detalle', venta: venta, errors: err, prodes:tmpDescripcion } );
            }
        });
    }
];

exports.venta_editar_producto_get = function(req, res, next) {

    async.parallel({
        venta: function(callback) {

            Venta.findById(req.params.id)
              .exec(callback);
        },
        
        producto: function(callback) {

            Venta.find({ '_id': req.params.id}, {'productos': {$elemMatch:{'producto': req.params.idproducto}} })
              .populate('productos.producto')
              .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
          var producto = results.producto[0].productos[0];
          
        if (results.venta==null) { // No results.
            var err = [{msg:'Venta no encontrada'}];
            err.status = 404;
            return next(err);
        }
        
        // Successful, so render.
        res.render('venta_producto_form', { title: 'Editar Producto', tipo:'editar', venta: results.venta, producto: producto, prodes: producto.producto.descripcion } );
    });

};

exports.venta_editar_producto_post = [
    body('cantidad', 'Cantidad requerida').isNumeric({gt:0}),
 
    sanitizeBody('cantidad').trim().escape(),
 
    (req, res, next) => {
        var id = req.params.id;
        var idproducto = req.params.idproducto;
        const errors = validationResult(req);

        Venta.findById(id).exec(function (err, venta) {
            if (err) { return next(err);}

            Venta.find({ '_id': req.params.id}, {'productos': {$elemMatch:{'producto': idproducto}} })
                .exec(function (err, ventaPro) {
                if (err) { return next(err);}
                var ventaProducto = ventaPro[0].productos[0];
            
                Producto.findById(idproducto).exec(function (err, pro) {
                    if (err) { return next(err);}

                    if (!pro ){
                        var err = [{msg:'No existe el producto'}];
                        res.render('venta_producto_form', { title: 'Editar Producto', tipo:'editar', venta: venta, producto: producto, errors: err } );
                    }
                    else {
                        var producto = {
                            producto: idproducto,
                            cantidad: Math.round(req.body.cantidad),
                            importe: Math.round(req.body.cantidad * pro.precio*100)/100, 
                            medias: Math.round(req.body.cantidad / 6)
                        };

                        if (!errors.isEmpty()) {
                            
                            console.log("entra a errores");
                            if (venta==null) { // No results.
                                var err = new Error('Venta no encontrada');
                                
                                err.status = 404;
                                return next(err);
                            }
                            // Successful, so render.
                            res.render('venta_producto_form', { title: 'Editar Producto', tipo:'editar', venta: venta, producto: producto, errors:err, prodes:pro.descripcion  } );                            
                        }
                        else {
                            // Data from form is valid.
                            var venta_subtotal = venta.subtotal + producto.importe - ventaProducto.importe;
                            var venta_total = venta_subtotal - venta.descuento;
                            var venta_no_medias = venta.no_medias + producto.medias - ventaProducto.medias;
                            var venta_no_piezas = venta.no_piezas + producto.cantidad - ventaProducto.cantidad;
                            
                            Venta.updateOne({_id: id, 'productos.producto': idproducto}, {$set: {total: venta_total, subtotal: venta_subtotal, no_piezas: venta_no_piezas, no_medias: venta_no_medias, 'productos.$.cantidad': producto.cantidad, 'productos.$.importe': producto.importe, 'productos.$.medias': producto.medias }}, function (err) {
                            if (err) { return next(err); }
                            // Genre saved. Redirect to genre detail page.
                            res.redirect(venta.url);
                            });
                        }
                    }
                });
            });
        });
    }
];

exports.venta_eliminar_producto_get = function(req, res, next) {

    async.parallel({
        venta: function(callback) {

            Venta.findById(req.params.id)
              .exec(callback);
        },        
        producto: function(callback) {

            Venta.find({ '_id': req.params.id}, {'productos': {$elemMatch:{'producto': req.params.idproducto}} })
              .populate('productos.producto')
              .exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
          var producto = results.producto[0].productos[0];
          
        if (results.venta==null) { // No results.
            var err = [{msg:'Venta no encontrada'}];
            err.status = 404;
            return next(err);
        }
        
        res.render('venta_producto_form', { title: 'Eliminar Producto de la venta', tipo:'eliminar', venta: results.venta, producto: producto, prodes:producto.producto.descripcion } );
    });

};

exports.venta_eliminar_producto_post = function(req, res, next) {
    var id = req.params.id;
    var idproducto = req.params.idproducto;
    
    Venta.findById(id).exec(function (err, venta) {
        if (err) { return next(err);}

        Venta.find({ '_id': req.params.id}, {'productos': {$elemMatch:{'producto': idproducto}} })
            .exec(function (err, ventaPro) {
            if (err) { return next(err);}
            var ventaProducto = ventaPro[0].productos[0];
        
            if (venta==null) { // No results.
                var err = new Error('Venta no encontrada');
                
                err.status = 404;
                return next(err);
            }

            if (ventaPro==null) { // No results.
                var err = new Error('Producto no encontrado');
                
                err.status = 404;
                return next(err);
            }
                
            // Actualiza los totales de la venta.
            var totalsindesc = venta.total + venta.descuento; //VQuiroga
            //var venta_subtotal = venta.total - ventaProducto.importe;
            var venta_subtotal = totalsindesc - ventaProducto.importe;//VQuiroga
            var venta_total =  venta_subtotal - venta.descuento;
            var venta_no_medias = venta.no_medias  - ventaProducto.medias;
            var venta_no_piezas = venta.no_piezas  - ventaProducto.cantidad;
            console.log("actualizar totales",venta_subtotal,venta_total,venta_no_medias,venta_no_piezas);
            Venta.updateOne({_id: id}, { $pull: {productos: {producto:idproducto}}, $set: {total: venta_total, subtotal: venta_subtotal, no_piezas: venta_no_piezas, no_medias: venta_no_medias}}, function (err) {    
                if (err) { return next(err); }
                // Venta guardada. Redirect al detalle de la venta.
                res.redirect(venta.url);
            });
        });
    });
}

exports.venta_create_get = function(req, res, next) {
    
    Venta.findOne().sort({secuencia:-1}).exec(function (err, max_secuencia) {
      if(err) {return next(err);}
      var secuencia = 0;
      
      if (max_secuencia)
        secuencia =max_secuencia.secuencia +1;
      else
        secuencia = 1;

      var venta = new Venta ({
          secuencia: secuencia,
          productos: []
      });
      venta.save(function (err) {
          if (err) { return next(err); }
          // Venta guardada. Redirect al detalle de la venta.
          res.redirect(venta.url);
        });    
    
    }); 
};

//Api
exports.venta_api_create_get = function(req, res) {
    
    Venta.findOne().sort({secuencia:-1}).exec(function (err, max_secuencia) {
      if(err) {return err;}
      var secuencia = 0;
      
      if (max_secuencia)
        secuencia =max_secuencia.secuencia +1;
      else
        secuencia = 1;

      var venta = new Venta ({
          secuencia: secuencia,
          productos: []
      });
      venta.save(function (err) {
          if (err) { return err; }
          // Venta guardada. Redirect al detalle de la venta.
          res.json(venta);
        
        });    
    
    }); 
};



exports.venta_busqueda = function(req, res, next) {
    var id = req.params.id;
    var id1 = id.substring(0,1);
    var id2 = id.substring(1);

    if((id1 == 'A' || id1 == '@') && !isNaN(id2)) {
        Producto.find({articulo: id2}).exec(function (err, list_productos) {
            if(err) {return next(err);}
            
            var results = new Array;
            list_productos.forEach(producto => {
                results.push(producto.descripcion_art);
            });
            
            res.send(results);
            
            });
    
    }
    else {
    
        Producto.find({descripcion: {$regex: '.*' + id + '.*'}}).exec(function (err, list_productos) {
        if(err) {return next(err);}
        
        var results = new Array;
        list_productos.forEach(producto => {
            results.push(producto.descripcion_art);
        });
        
        res.send(results);
        
        });
    } 
};

exports.venta_busquedaprecio = function(req, res, next) {
    var id = req.params.id;
    var id1 = id.substring(0,1);
    var id2 = id.substring(1);

    if((id1 == 'A' || id1 == '@') && !isNaN(id2)) {
        Producto.find({articulo: id2}).exec(function (err, list_productos) {
            if(err) {return next(err);}
            
            var results = new Array;
            list_productos.forEach(producto => {
                results.push(producto.descripcion_precio);
            });
            
            res.send(results);
            
            });
    }
    else {
        Producto.find({descripcion: {$regex: '.*' + id + '.*'}}).exec(function (err, list_productos) {
        if(err) {return next(err);}
        
        var results = new Array;
        list_productos.forEach(producto => {
            results.push(producto.descripcion_precio);
        });
        
        res.send(results);
        
        }); 
    }
};
