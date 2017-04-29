var express = require('express')
var router = express.Router()
const models = require('../models')
const moment = require('moment')
// load shared functions
require('./routeFunctions')()
const current = moment(new Date()).format('YYYY-MM-DD')
let returnBy = moment(new Date()).add(1, 'week').format('YYYY-MM-DD')
let hasErr = false

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
    res.render('loans/loans_index', { loans: loans, title: 'Overdue' })
  }).catch(err => {
    errorHandler(err)
  })
})

/* GET Checked loans page. */
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
    // render loans into checked to change table shown
    res.render('loans/loans_index', { loans: loans, title: 'Checked Out' })
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
    let viewData = {
      books: data[0],
      patrons: data[1],
      title: 'New Loan',
      today: current,
      returnBy: returnBy,
      errorMessage: 'Oops'
    }
    // check if put added error to hasErr variable
    if (hasErr) {
      viewData.errors = hasErr.errors
      hasErr = false
    }
    res.render('loans/loans_new', viewData)
  }).catch(err => {
    errorHandler(err)
  })
})

// /* POST create loan. */
router.post('/new', function (req, res, next) {
  models.Loans.create(req.body).then(loan => {
    res.redirect('/loans/')
  }).catch((err) => {
    if (err.name === 'SequelizeValidationError') {
      // pass current error into hasErr variable and
      // redirect to loans new to pass into error view template
      hasErr = err
      res.redirect('/loans/new')
    } else {
      // throw err into the next catch method
      throw err
    }
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
    if (book) {
      parseDate(book)
      let viewData = {
        book: book[0],
        loan: book[0].Loans[0],
        patron: book[0].Loans[0].Patron,
        btn: 'Return Book',
        today: current
      }
      if (hasErr) {
        viewData.errors = hasErr.errors
        hasErr = false
      }
      res.render('loans/return_book', viewData)
    } else {
      errorHandler(undefined, res)
    }
  }).catch(err => {
    errorHandler(err)
  })
})

/* PUT update article. */
router.put('/return/:id', function (req, res, next) {
  models.Loans.findById(req.params.id).then((loan) => {
    if (loan) {
      return loan.update(req.body)
    } else {
      errorHandler(undefined, res)
    }
  }).then((loan) => {
    res.redirect('/loans/')
  }).catch((err) => {
    if (err.name === 'SequelizeValidationError') {
      hasErr = err
      res.redirect('/loans/return/' + req.params.id)
    } else {
      // throw err into the next catch method
      throw err
    }
  })
  .catch(err => {
      errorHandler(err)
  })
})

module.exports = router
