var express = require('express')
var router = express.Router()
const models = require('../models')
const moment = require('moment')
require('./routeFunctions')()
let hasErr = false

/* GET all books page. */
router.get('/', function (req, res, next) {
  models.Books.findAll({
    order: [['title', 'ASC']]
  })
  .then(books => {
    res.render('books/books_index', { books: books })
  }).catch(err => {
    errorHandler(err)
  })
})

/* GET Overdue books page. */
router.get('/overdue', function (req, res, next) {
  const current = moment(new Date()).format('YYYY-MM-DD')
  models.Loans.findAll({
    include: [models.Books],
    where: {
      return_by: {
        $lt: current
      },
      returned_on: null
    },
    order: [[models.Books, 'title', 'ASC']]
  })
  .then(books => {
    res.render('books/books_index', { filtered: books, title: 'Overdue' })
  }).catch(err => {
    errorHandler(err)
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
    errorHandler(err)
  })
})

/* add books page. */
router.get('/new', function (req, res, next) {
  let viewData = {
    book: models.Books.build(),
    title: 'New Book',
    btn: 'Create New Book'
  }
  // check if put added error to hasErr variable
  if (hasErr) {
    viewData.errors = hasErr.errors
    hasErr = false
  }
  res.render('books/book_new', viewData)
})

/* POST create book. */
router.post('/new', function (req, res, next) {
  if (!req.body.first_published) {
    req.body.first_published = null
  }
  // console.log(req.body.title);
  models.Books.create(req.body).then(book => {
    res.redirect('/books/')
  }).catch((err) => {
    if (err.name === 'SequelizeValidationError') {
      hasErr = err
      res.redirect('/books/new')
    } else {
      // throw err into the next catch method
      throw err
    }
  }).catch(err => {
    errorHandler(err)
  })
})

/* GET individual book. */
router.get('/:id', function (req, res, next) {
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
    if (book.length) {
      parseDate(book)
      let viewData = {
        book: book[0],
        loans: book[0].Loans,
        btn: 'Update'
      }
      if (hasErr) {
        viewData.errors = hasErr.errors
        hasErr = false
      }
      res.render('books/book', viewData)
    } else {
      // send response error
      errorHandler(undefined, res)
    }
  }).catch(err => {
    errorHandler(err)
  })
})

/* PUT update article. */
router.put('/:id', function (req, res, next) {
  models.Books.findById(req.params.id).then((book) => {
    if (book) {
      return book.update(req.body)
    } else {
      errorHandler(undefined, res)
    }
  }).then((book) => {
    res.redirect('/books/')
  }).catch((err) => {
    if (err.name === 'SequelizeValidationError') {
      hasErr = err
      res.redirect('/books/' + req.params.id)
    } else {
      // throw err into the next catch method
      throw err
    }
  }).catch(err => {
    errorHandler(err)
  })
})

module.exports = router
