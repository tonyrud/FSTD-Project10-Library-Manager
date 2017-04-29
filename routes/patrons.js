var express = require('express')
var router = express.Router()
const models = require('../models')
require('./routeFunctions')()

/* GET all patrons page. */
router.get('/', function (req, res, next) {
  models.Patrons.findAll({
    order: [['id', 'ASC']]
  })
  .then(patrons => {
    res.render('patrons/patrons_index', {patrons: patrons, title: 'Patrons'})
  }).catch(err => {
    console.log(`Index Error: ${err}`)
    // res.send(500)
  })
})


/* add patrons page. */
router.get('/new', function (req, res, next) {
  res.render('patrons/patron_new', {
    patron: models.Patrons.build(),
    title: 'New Patron',
    btn: 'Create New Patron'
  })
})

/* POST create patron. */
router.post('/new', function (req, res, next) {
  debugger
  models.Patrons.create(req.body).then(patron => {
    res.redirect('/patrons/')
  }).catch((err) => {
    debugger

  }).catch(err => {
    console.log(`POST Error: ${err}`)
  })
})

/* GET individual patron. */
router.get('/:id', function (req, res, next) {
  models.Patrons.findAll({
    include: [{
      model: models.Loans,
      include: [
        models.Books
      ]
    }],
    where: { id: req.params.id }
  })
  .then((patron) => {
    parseDate(patron)
    if (patron) {
      res.render('patrons/patron', {
        patron: patron[0],
        loans: patron[0].Loans,
        btn: 'Update'
      })
    } else {
      res.send(404)
    }
  }).catch(err => {
    console.log(`ID Error: ${err}`)
  })
})

/* PUT update article. */
router.put('/:id', function (req, res, next) {
  models.Patrons.findById(req.params.id).then((patron) => {
    if (patron) {
      return patron.update(req.body)
    } else {
      res.send(404)
    }
  }).then((patron) => {
    res.redirect('/patrons')
  }).catch((err) => {

  }).catch(err => {
    console.log(` PUT Error: ${err}`)
  })
})

module.exports = router
