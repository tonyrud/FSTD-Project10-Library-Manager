var express = require('express')
var router = express.Router()
const models = require('../models')
require('./routeFunctions')()
let hasErr = false

/* GET all patrons page. */
router.get('/', function (req, res, next) {
  models.Patrons.findAll({
    order: [['id', 'ASC']]
  })
  .then(patrons => {
    res.render('patrons/patrons_index', {patrons: patrons, title: 'Patrons'})
  }).catch(err => {
    errorHandler(err)
  })
})


/* add patrons page. */
router.get('/new', function (req, res, next) {
  let viewData = {
    patron: models.Patrons.build(),
    title: 'New Patron',
    btn: 'Create New Patron',
    errorMessage: 'Oops'
  }
  // check if put added error to hasErr variable
  if (hasErr) {
    viewData.errors = hasErr.errors
    hasErr = false
  }
  res.render('patrons/patron_new', viewData)
})

/* POST create patron. */
router.post('/new', function (req, res, next) {
  models.Patrons.create(req.body).then(patron => {
    res.redirect('/patrons/')
  })
  .catch((err) => {
    if (err.name === 'SequelizeValidationError') {
      hasErr = err
      res.redirect('/patrons/new')
    } else {
      // throw err into the next catch method
      throw err
    }
  })
  .catch(err => {
    errorHandler(err)
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
      let viewData = {
        patron: patron[0],
        loans: patron[0].Loans,
        btn: 'Update',
        errorMessage: 'Oops'
      }
      if (hasErr) {
        viewData.errors = hasErr.errors
        hasErr = false
      }
      res.render('patrons/patron', viewData)
    } else {
      errorHandler(undefined, res)
    }
  }).catch(err => {
    errorHandler(err)
  })
})

/* PUT update patron. */
router.put('/:id', function (req, res, next) {
  models.Patrons.findById(req.params.id).then((patron) => {
    if (patron) {
      return patron.update(req.body)
    } else {
      errorHandler(undefined, res)
    }
  }).then((patron) => {
    res.redirect('/patrons')
  }).catch((err) => {
    if (err.name === 'SequelizeValidationError') {
      hasErr = err
      res.redirect('/patrons/' + req.params.id)
    } else {
      // throw err into the next catch method
      throw err
    }
  }).catch(err => {
    errorHandler(err)
  })
})

module.exports = router
