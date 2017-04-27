var express = require('express')
var router = express.Router()
const models = require('../models')

/* GET all loans page. */
router.get('/', function (req, res, next) {
  models.Loans.findAll({
    include: [models.Patrons, models.Books]
  })
  .then(loans => {
    res.render('loans/loans_index', {loans: loans, title: 'Loans'})
  }).catch(err => {
    console.log(`Index Error: ${err}`)
    // res.send(500)
  })
})

/* GET Checked books page. */
router.get('/checked', function (req, res, next) {
  // get loans, add books to loans, where returned on is empty
  models.Loans.findAll({
    include: [models.Books],
    where: {
      returned_on: null
    },
    order: [[models.Books, 'title', 'ASC']]
  })
  .then(books => {
    // render books into checked to change table shown
    res.render('books/books_index', { filtered: books, title: 'Checked Out' })
  }).catch(err => {
    console.log(`Checked Error: ${err}`)
  })
})


/* new patrons page. */
router.get('/new', function (req, res, next) {

  const books = models.Books.findAll()
  const patrons = models.Patrons.findAll()
  Promise.all([books, patrons])
  .then(data => {
    res.render('loans/loans_new', {books: data[0], patrons: data[1], title: 'New Loan'})
  }).catch(err => {
    console.log(`New Loan Error: ${err}`)
  })
})

// /* POST create patron. */
router.post('/new', function (req, res, next) {
    debugger
  models.Loans.create(req.body).then(loan => {
    debugger
    res.redirect('/loans/')
  }).catch((err) => {

  }).catch(err => {
    console.log(`POST Error: ${err}`)
  })
})

// /* GET individual patron. */
// router.get('/:id', function (req, res, next) {
//   models.Patrons.findAll({
//     include: [{
//       model: models.Loans,
//       include: [
//         models.Books
//       ]
//     }],
//     where: { id: req.params.id }
//   })
//   .then((patron) => {
//     if (patron) {
//       res.render('patrons/patron', {
//         patron: patron[0],
//         loans: patron[0].Loans,
//         btn: 'Update'
//       })
//     } else {
//       res.send(404)
//     }
//   }).catch(err => {
//     console.log(`ID Error: ${err}`)
//   })
// })

// /* PUT update article. */
// router.put('/:id', function (req, res, next) {
//   models.Patrons.findById(req.params.id).then((patron) => {
//     if (patron) {
//       return patron.update(req.body)
//     } else {
//       res.send(404)
//     }
//   }).then((patron) => {
//     res.redirect('/patrons')
//   }).catch((err) => {

//   }).catch(err => {
//     console.log(` PUT Error: ${err}`)
//   })
// })
module.exports = router
