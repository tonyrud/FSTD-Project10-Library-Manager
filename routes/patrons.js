var express = require('express')
var router = express.Router()
const models = require('../models')

/* GET all patrons page. */
router.get('/', function (req, res, next) {
  models.Patrons.findAll({
    order: [['id', 'ASC']]
  })
  .then(patrons => {
    res.render('patrons/patrons_index', { patrons: patrons , title: 'Patrons'})
  }).catch(err => {
    console.log(`Error: ${err}`)
    // res.send(500)
  })
})

/* GET individual book. */
router.get('/:id', function (req, res, next) {
    // debugger
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
    console.log(`Error: ${err}`)
  })
})

module.exports = router
