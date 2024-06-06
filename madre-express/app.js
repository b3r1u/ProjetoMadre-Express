var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
var multer = require('multer');
var fs = require('fs');
var axios = require('axios');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var usuariosRouter = require('./routes/usuarios');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
  }
});
var upload = multer({ storage: storage });

app.post('/pacotes', upload.single('imagem'), (req, res) => {
  const novoPacote = {
    id: Date.now(),
    pais: req.body.pais,
    valorPassagem: req.body.valorPassagem,
    imagem: `/uploads/${req.file.filename}`
  };

  const dbPath = path.join(__dirname, 'db.json');
  const db = require(dbPath);
  db.pacotes.push(novoPacote);

  fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
  res.json(novoPacote);
});

// Rota para listar pacotes
app.get('/pacotes', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:4000/pacotes');
    const pacotes = response.data;
    res.render('pacotes', { pacotes });
  } catch (error) {
    console.error('Erro ao buscar pacotes:', error);
    res.status(500).send('Erro ao buscar pacotes');
  }
});

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/usuarios', usuariosRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
