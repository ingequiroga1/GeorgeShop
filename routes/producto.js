var express = require('express');
var router = express.Router();

var producto_controller = require('../controllers/productoController');

router.get('/create', producto_controller.producto_create_get);
router.post('/create', producto_controller.producto_create_post);

router.get('/lista/:msg', producto_controller.producto_list);
router.get('/lista', producto_controller.producto_list);
router.get('/api/lista', producto_controller.producto_api_list);

router.get('/:id/editar', producto_controller.producto_editar_get);
router.post('/:id/editar', producto_controller.producto_editar_post);

router.get('/:id/eliminar', producto_controller.producto_eliminar_get);
router.post('/:id/eliminar', producto_controller.producto_eliminar_post);

router.post('/pass', producto_controller.valida_password_post);
router.post('/passChg', producto_controller.cambia_password_post);

router.get('/:id/qr', producto_controller.producto_qr_get);
/*
router.get('/:id', producto_controller.producto_detail);
*/
module.exports = router;