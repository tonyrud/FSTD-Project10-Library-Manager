var express = require('express')
var router = express.Router()
const models = require('../models')

/* GET all loans page. */
router.get('/', function (req, res, next) {
  models.Loans.findAll({
    include: [models.Patrons, models.Books]
  })
  .then(loans => {
    // parse dates to 10 characters
    loans.map((item) => {
      item.dataValues.loaned_on = item.loaned_on.slice(0, 10)
      item.dataValues.return_by = item.return_by.slice(0, 10)
    })
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

// /* POST create loan. */
router.post('/new', function (req, res, next) {
  models.Loans.create(req.body).then(loan => {
    res.redirect('/loans/')
  }).catch((err) => {

  }).catch(err => {
  console.log(`POST Error: ${err}`)
  })
})

/* GET individual book to return. */
router.get('/return/:id', function (req, res, next) {
  models.Books.findAll({
    include: [{
      model: models.Loans,
      include: [
        models.Patrons
      ]
    }],
    where: { id: req.params.id }
  })
  .then((book) => {
    // debugger
    if (book) {
      res.render('loans/return_book', {
        book: book[0],
        loan: book[0].Loans[0],
        patron: book[0].Loans[0].Patron,
        btn: 'Return Book'
      })
    } else {
      res.send(404)
    }
  }).catch(err => {
    console.log(`Return Error: ${err}`)
  })
})

module.exports = router
