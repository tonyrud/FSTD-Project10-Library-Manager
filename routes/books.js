var express = require('express')
var router = express.Router()
const models = require('../models')
const moment = require('moment')
require('./routeFunctions')()

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
  // debugger
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
  res.render('books/book_new', {
    book: models.Books.build(),
    title: 'New Book',
    btn: 'Create New Book'
  })
})

/* POST create book. */
router.post('/new', function (req, res, next) {
  models.Books.create(req.body).then(book => {
    res.redirect('/books/')
  }).catch((err) => {
    debugger
    if (err.name === 'SequelizeValidationError') {
      res.render('books/book_new', {
        book: models.Books.build(req.body),
        title: 'New Book',
        message: 'Ooops!',
        errors: err.errors
      })
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
      res.render('books/book', {
        book: book[0],
        loans: book[0].Loans,
        btn: 'Update'
      })
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
  // debugger
  models.Books.findById(req.params.id).then((book) => {
    if (book) {
      return book.update(req.body)
    } else {
      errorHandler(undefined, res)
    }
  }).then((book) => {
    res.redirect('/books/' + req.params.id)
  }).catch((err) => {
    models.Books.findAll({
      include: [{
        model: models.Loans,
        include: [
          models.Patrons
        ]
      }],
      where: { id: req.params.id }
    })
    .then(book => {
      if (err.name === 'SequelizeValidationError') {
        let bookBuild = models.Books.build(req.body)
        res.render('books/book', {
          book: bookBuild,
          loans: book[0].Loans,
          message: 'Ooops!',
          errors: err.errors
        })
      } else {
        // throw err into the next catch method
        throw err
      }

    })
  }).catch(err => {
    errorHandler(err)
  })
})

module.exports = router
