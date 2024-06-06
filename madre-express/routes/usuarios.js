var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('usuarios', { title: 'Projeto Madre' });
});

module.exports = router;