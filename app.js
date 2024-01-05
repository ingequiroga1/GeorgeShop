var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var cors = require('cors')

var indexRouter = require('./routes/index');
// var usersRouter = require('./routes/users');
// var catalogRouter = require('./routes/catalog');
var ventaRouter = require('./routes/venta');
var productoRouter = require('./routes/producto');

var app = express();

//Set up mongoose connection
var mongoose = require('mongoose');
var mongoDB = 'mongodb://127.0.0.1/zap';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(cors({origin:true, credentials:true}));

app.use('/', indexRouter);
// app.use('/users', usersRouter);
// app.use('/catalog', catalogRouter);
app.use('/venta', ventaRouter);
app.use('/producto', productoRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// Inicialización de Instascan
// app.use(express.static(__dirname + '/node_modules/instascan'));

// Inicia la cámara y escanea códigos QR
// app.get('/scan', (req, res) => {
//   Instascan.Camera.getCameras().then((cameras) => {
//     if (cameras.length > 0) {
//       const scanner = new Instascan.Scanner({
//         video: document.getElementById('preview'), // Asegúrate de tener un elemento HTML con el ID 'preview' en tu vista Pug
//       });

//       scanner.addListener('scan', (content) => {
//         console.log('Escaneado:', content);
//         // Aquí puedes hacer lo que necesites con el contenido escaneado
//       });

//       scanner.start(cameras[0]);
//       res.send('Escaneando códigos QR...');
//     } else {
//       res.send('No se encontraron cámaras en el dispositivo.');
//     }
//   }).catch((e) => {
//     console.error(e);
//     res.status(500).send('Error al iniciar la cámara');
//   });
// });

module.exports = app;
