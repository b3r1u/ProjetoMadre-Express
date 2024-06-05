var express = require('express');
var router = express.Router();
var fs = require('fs');
var path = require('path');
var multer = require('multer');
var upload = multer({ dest: 'uploads/' });

// Carregar os pacotes do arquivo JSON
function loadPacotes() {
  const data = fs.readFileSync(path.join(__dirname, '../db.json'), 'utf-8');
  return JSON.parse(data).pacotes;
}

// Salvar os pacotes no arquivo JSON
function savePacotes(pacotes) {
  const data = JSON.stringify({ pacotes }, null, 2);
  fs.writeFileSync(path.join(__dirname, '../db.json'), data, 'utf-8');
}

// Rota para listar todos os pacotes
router.get('/', function(req, res, next) {
  const pacotes = loadPacotes();
  res.render('pacotes', { pacotes });
});

// Rota para adicionar um novo pacote
router.post('/', upload.single('imagem'), function(req, res, next) {
  const pacotes = loadPacotes();
  const newId = pacotes.length > 0 ? pacotes[pacotes.length - 1].id + 1 : 1;
  const newPacote = {
    id: newId,
    pais: req.body.pais,
    valorPassagem: req.body.valorPassagem,
    duracao: req.body.duracao,
    passagem: req.body.passagem,
    validade: req.body.validade,
    saidas: req.body.saidas,
    refeicao: req.body.refeicao,
    imagem: req.file ? req.file.path : 'uploads/default.jpg' // Caminho da imagem
  };
  pacotes.push(newPacote);
  savePacotes(pacotes);
  res.redirect('/pacotes');
});

// Rota para editar um pacote
router.put('/:id', function(req, res, next) {
  const pacotes = loadPacotes();
  const pacoteIndex = pacotes.findIndex(p => p.id == req.params.id);
  if (pacoteIndex !== -1) {
    pacotes[pacoteIndex] = {
      ...pacotes[pacoteIndex],
      pais: req.body.pais,
      valorPassagem: req.body.valorPassagem,
      duracao: req.body.duracao,
      passagem: req.body.passagem,
      validade: req.body.validade,
      saidas: req.body.saidas,
      refeicao: req.body.refeicao
    };
    savePacotes(pacotes);
    res.json({ message: 'Pacote atualizado com sucesso' });
  } else {
    res.status(404).json({ message: 'Pacote não encontrado' });
  }
});

// Rota para deletar um pacote
router.delete('/:id', function(req, res, next) {
  let pacotes = loadPacotes();
  pacotes = pacotes.filter(p => p.id != req.params.id);
  savePacotes(pacotes);
  res.json({ message: 'Pacote deletado com sucesso' });
});


module.exports = router;
