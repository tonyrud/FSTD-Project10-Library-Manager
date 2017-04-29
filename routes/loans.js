var express = require('express')
var router = express.Router()
const models = require('../models')
const moment = require('moment')
// load shared functions
require('./routeFunctions')()
const current = moment(new Date()).format('YYYY-MM-DD')
const returnBy = moment(new Date()).add(1, 'week').format('YYYY-MM-DD')

/* GET all loans page. */
router.get('/', function (req, res, next) {
  models.Loans.findAll({
    include: [models.Patrons, models.Books]
  })
  .then(loans => {
    // parse dates to 10 characters
    parseDate(loans, 'loans')
    res.render('loans/loans_index', {loans: loans, title: 'Loans'})
  }).catch(err => {
    errorHandler(err)
  })
})

/* GET Overdue loans page. */
router.get('/overdue', function (req, res, next) {
  const current = moment(new Date()).format('YYYY-MM-DD')
  // debugger
  models.Loans.findAll({
    include: [models.Books, models.Patrons],
    where: {
      return_by: {
        $lt: current
      },
      returned_on: null
    },
    order: [[models.Books, 'title', 'ASC']]
  })
  .then(loans => {
    // debugger
    res.render('loans/loans_index', { loans: loans, title: 'Overdue' })
  }).catch(err => {
    errorHandler(err)
  })
})

/* GET Checked books page. */
router.get('/checked', function (req, res, next) {
  // get loans, add books to loans, where returned on is empty
  models.Loans.findAll({
    include: [models.Books, models.Patrons],
    where: {
      returned_on: null
    },
    order: [[models.Books, 'title', 'ASC']]
  })
  .then(loans => {
    parseDate(loans, 'loans')
    // debugger
    // render loans into checked to change table shown
    res.render('loans/loans_index', { loans: loans, title: 'Checked Out' })
  }).catch(err => {
    errorHandler(err)
  })
})

/* GET Checked patrons page. */
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
    errorHandler(err)
  })
})


/* new loan page. */
router.get('/new', function (req, res, next) {
  const books = models.Books.findAll()
  const patrons = models.Patrons.findAll()
  Promise.all([books, patrons])
  .then(data => {
    res.render('loans/loans_new', {
      books: data[0],
      patrons: data[1],
      title: 'New Loan',
      today: current,
      returnBy: returnBy
    })
  }).catch(err => {
    errorHandler(err)
  })
})

// /* POST create loan. */
router.post('/new', function (req, res, next) {
  models.Loans.create(req.body).then(loan => {
    res.redirect('/loans/')
  }).catch((err) => {

  }).catch(err => {
  errorHandler(err)
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
    // parse dates to 10 characters
    parseDate(book)
    if (book) {
      res.render('loans/return_book', {
        book: book[0],
        loan: book[0].Loans[0],
        patron: book[0].Loans[0].Patron,
        btn: 'Return Book',
        today: current
      })
    } else {
      res.send(404)
    }
  }).catch(err => {
    errorHandler(err)
  })
})

/* PUT update article. */
router.put('/return/:id', function (req, res, next) {
  // debugger
  models.Loans.findById(req.params.id).then((loan) => {
    if (loan) {
      return loan.update(req.body)
    } else {
      res.send(404)
    }
  }).then((loan) => {
    res.redirect('/loans/')
  }).catch((err) => {
    // if (err.name === 'SequelizeValidationError') {
    //   const article = models.Books.build(req.body)
    //   article.id = req.params.id
    //   res.render('articles/new', {
    //     article: article,
    //     title: 'Edit Article',
    //     errors: err.errors
    //   })
    // } else {
    //   throw err
    // }
  }).catch(err => {
    errorHandler(err)
  })
})

module.exports = router
