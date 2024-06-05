var express = require('express');
var router = express.Router();
var axios = require('axios');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Projeto Madre' });
});

// Rota para listar pacotes
router.get('/pacotes', async (req, res) => {
  try {
    const response = await axios.get('http://localhost:3000/pacotes');
    const pacotes = response.data;
    res.render('pacotes', { pacotes });
  } catch (error) {
    console.error('Erro ao buscar pacotes:', error);
    res.status(500).send('Erro ao buscar pacotes');
  }
});

module.exports = router;
