const express = require('express')
const router = express.Router()

const _404Controller = require('../controllers/404Controller')


router.get('*', _404Controller._404Page)
//router.get('/500', _404Controller._500Page)
module.exports = router
