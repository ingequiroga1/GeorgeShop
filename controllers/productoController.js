const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');
var Producto = require('../models/producto');
var Config = require('../models/config');

// Muestra lista de las Productos.
exports.producto_list = function(req, res, next) {
    var mensaje = req.params.msg;
    var msg='';
    if(mensaje=='okpwdchg')
        msg='Se ha realizado el cambio de contraseña';
    if(mensaje=='errpwd')
        msg='Contraseña Incorrecta';
    Producto.find({}).sort({articulo:1})
      .exec(function (err, list_productos) {
        if (err) { return next(err); }
        //Successful, so render
        res.render('producto_list', { title: 'Lista de Productos', producto_list: list_productos, msg:msg });
      });  
  };
  
exports.producto_create_get = function(req, res) {
    res.render('producto_form', {title: 'Nuevo Producto', tipo: 'agregar'});
};

exports.producto_create_post = [
    body('articulo', 'Número de Artículo requerido').isNumeric({gt:0}),
    body('descripcion', 'Descripción requerida').isLength({min:1}).trim(),
    body('precio', 'Precio requerido').isNumeric({gt:0}),

    sanitizeBody('articulo').trim().escape(),
    sanitizeBody('prodescripcion').trim().escape(),
    sanitizeBody('precio').trim().escape(),

    (req, res, next) => {
        const errors = validationResult(req);
        var nuevoProducto = new Producto ({
            articulo: req.body.articulo,
            descripcion: req.body.descripcion,
            precio: req.body.precio,
            linea:"" 
        });

        if (!errors.isEmpty()) {
            console.log(errors);
            res.render('producto_form', { title: 'Nuevo Producto', tipo: 'agregar', producto: nuevoProducto, errors:errors.array()} );
            return;
        }
        else {
            
            Producto.findOne({articulo: nuevoProducto.articulo}).exec(function (err, pro) {
                if (err) { console.log(err); return next(err);}
                console.log(pro);                
                if (pro ){
                    var err = [{msg:'Número de  artículo ya existe'}];
                    console.log(err);
                    res.render('producto_form', { title: 'Nuevo Producto', tipo: 'agregar', producto: nuevoProducto, errors:err} );
                }
                else {
                    Producto.findOne({descripcion: nuevoProducto.descripcion}).exec(function (err, pro) {
                        if (err) { console.log(err); return next(err);}
                        console.log(pro);                
                        if (pro ){
                            var err = [{msg:'Descripción de artículo ya existe'}];
                            res.render('producto_form', { title: 'Nuevo Producto', tipo: 'agregar', producto: nuevoProducto, errors:err} );
                        }
                        else{
                            nuevoProducto.save(function (err) {
                                if (err) { return next(err); }
                                // Producto guardado. Redirect a lista de productos.
                                res.redirect('lista');
                            });
                        }
                    });
                }
            });
        }                    
        
    }
];


exports.producto_editar_get = function(req, res, next) {

    Producto.findById(req.params.id)
              .exec(function(err, producto) {
        if (err) { return next(err); }
          
        if (producto==null) { // No results.
            var err = [{msg:'Producto no encontrado'}];
            err.status = 404;
            return next(err);
        }
        
        // Successful, so render.
        res.render('producto_form', { title: 'Editar Producto', tipo:'editar', producto: producto } );
    });

};


exports.producto_editar_post = [
    body('articulo', 'Número de Artículo requerido').isNumeric({gt:0}),
    body('descripcion', 'Descripción requerida').isLength({min:1}).trim(),
    body('precio', 'Precio requerido').isNumeric({gt:0}),

    sanitizeBody('articulo').trim().escape(),
    sanitizeBody('prodescripcion').trim().escape(),
    sanitizeBody('precio').trim().escape(),

    (req, res, next) => {
        var id = req.params.id;
        const errors = validationResult(req);
        var nuevoProducto = new Producto ({
            articulo: req.body.articulo,
            descripcion: req.body.descripcion,
            precio: req.body.precio,
            linea:"" 
        });

        if (!errors.isEmpty()) {
            console.log(errors);
            res.render('producto_form', { title: 'Editar Producto', tipo: 'editar', producto: nuevoProducto, errors:errors.array()} );
            return;
        }
        else {
            
            Producto.findById(id).exec(function (err, pro) {
                if (err) { console.log(err); return next(err);}
                console.log(pro);                
                if (!pro ){
                    var err = [{msg:'Producto no existe'}];
                    console.log(err);
                    res.render('producto_form', { title: 'Editar Producto', tipo: 'editar',  errors:err} );
                }
                else {
                    Producto.updateOne({_id: id}, {$set: {descripcion: nuevoProducto.descripcion, precio: nuevoProducto.precio}}, function (err) {
                        if (err) { return next(err); }
                        // Producto guardado. Redirect a lista de productos.
                        res.redirect('../lista');
                    });
                }
            });
        }                    
    }
];



exports.producto_eliminar_get = function(req, res, next) {

    Producto.findById(req.params.id)
              .exec(function(err, producto) {
        if (err) { return next(err); }
          
        if (producto==null) { // No results.
            var err = [{msg:'Producto no encontrado'}];
            err.status = 404;
            return next(err);
        }
        
        // Successful, so render.
        res.render('producto_form', { title: 'Eliminar Producto', tipo:'eliminar', producto: producto } );
    });

};


exports.producto_eliminar_post = function(req, res, next) {
    var id = req.params.id;
    Producto.findByIdAndRemove(id, function deleteProducto(err) {
        if (err) { return next(err); }
        res.redirect('../lista');
    });    
};

exports.valida_password_post = function(req, res, next) {
    var id = req.params.id;
    Config.findOne().exec(function(err, conf) {
        if (err) { return next(err); }
        console.log(conf);
        if (conf==null) { // No results.
            var nuevoConf = new Config ({
                password: 'zap',
                nombreEmpresa: 'zap',
                dias_activos: 3
            });
            nuevoConf.save(function (err) {
                if (err) { return next(err); }
                // Producto guardado. Redirect a lista de productos.
                res.redirect('/producto/lista');
            });
        }
        else {
            if (conf.password == req.body.password)
                res.redirect('/producto/lista');
            else {
                res.redirect('/');
            }
        }        
    });
};

exports.cambia_password_post = function(req, res, next) {
    var id = req.params.id;
    Config.findOne().exec(function(err, conf) {
        if (err) { return next(err); }
          
        if (conf==null) { // No results.
            var nuevoConf = new Config ({
                password: 'zap',
                empresa: 'zap',
                dias_activos: 3
            });
            nuevoConf.save(function (err) {
                if (err) { return next(err); }
                // Producto guardado. Redirect a lista de productos.
                res.redirect('/producto/lista');
            });
        }
        else {
            if (conf.password == req.body.passwordActual) {
                Config.findOneAndUpdate({}, {$set: {password: req.body.passwordNueva}}, function (err) {
                    if (err) { return next(err); }
                    // Producto guardado. Redirect a lista de productos.
                    res.redirect('lista/okpwdchg');
                });
            }
            else {
                res.redirect('lista/errpwd');
            }
        }        
    });
};

