const express = require('express')
const router = express.Router()
const publicoController = require('../controllers/publicoController')
console.log('LOADED ROUTE ----> publico')


// ---> PAGINA INICIAL ✅
router.get('/', publicoController.publicoPage)

// ---> PESQUISAS DE INSTITUICOES ✅
router.post('/pesquisaPublica', publicoController.pesquisaPublica)
router.post('/getFruits', publicoController.getFruits)
router.get('/buscarDados', publicoController.buscarDados)
router.get('/livros', publicoController.livros)
router.post('/baixarLivro', publicoController.baixarLivro)
router.get('/orientacao', publicoController.orientacao)

// ---> ORIENTACAO VOCAIONAL ❌



module.exports = router