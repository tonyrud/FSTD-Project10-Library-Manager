// var express = require('express')
// var router = express.Router()
// const models = require('../models')

// /* GET all patrons page. */
// router.get('/', function (req, res, next) {
//   models.Patrons.findAll({
//     order: [['first_name', 'ASC']]
//   })
//   .then(patrons => {
//     res.render('patrons/index', { patrons: patrons })
//   }).catch(err => {
//     console.log(`Error: ${err}`)
//     // res.send(500)
//   })
// })