const express = require('express')
const router = express.Router()
const perfilController = require('../controllers/perfilController')






router.get('/verPerfil/:id', perfilController.verPerfil)
router.get('/voltarPerfil/:id', perfilController.verPerfil)
router.post('/baixar', perfilController.baixar)



module.exports = router

