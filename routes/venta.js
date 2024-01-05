var express = require('express');
var router = express.Router();

var venta_controller = require('../controllers/ventaController');

router.get('/create', venta_controller.venta_create_get);
//API VQUIROGA
router.get('/api/create', venta_controller.venta_api_create_get );

router.get('/lista', venta_controller.venta_list);
//API
router.get('/api/lista', venta_controller.venta_api_list);

router.get('/carga_productos', venta_controller.venta_carga_productos);

//Reportes
router.get('/report', venta_controller.venta_reportes);

router.post('/busqueda/:id', venta_controller.venta_busqueda);
router.post('/busquedaprecio/:id', venta_controller.venta_busquedaprecio);

//router.get('/:id/agregar_producto', venta_controller.venta_agregar_producto_get);
router.post('/:id/agregar_producto', venta_controller.venta_agregar_producto_post);

router.post('/api/:id/agregar_producto', venta_controller.venta_agregar_producto_api_post);


router.get('/:id/:idproducto/editar', venta_controller.venta_editar_producto_get);
router.post('/:id/:idproducto/editar', venta_controller.venta_editar_producto_post);

router.get('/:id/:idproducto/eliminar', venta_controller.venta_eliminar_producto_get);
router.post('/:id/:idproducto/eliminar', venta_controller.venta_eliminar_producto_post);

router.get('/:id/eliminar', venta_controller.venta_eliminar_get);
router.post('/:id/eliminar', venta_controller.venta_eliminar_post);

router.post('/:id/capturista', venta_controller.venta_capturista_post);
router.post('/api/:id/capturista', venta_controller.venta_api_capturista_post);
router.post('/:id/descuento', venta_controller.venta_descuento_post);
router.get('/:id/imprimir', venta_controller.venta_imprimir_get);

router.get('/:id', venta_controller.venta_detail);
//API VQUIROGA
router.get('/api/:id', venta_controller.venta_api_detail);


venta_controller.venta_eliminar_anterior(2);

module.exports = router;