var express = require('express')
var router = express.Router()
const models = require('../models')
const moment = require('moment')

/* GET all books page. */
router.get('/', function (req, res, next) {
  models.Books.findAll({
    order: [['title', 'ASC']]
  })
  .then(books => {
    res.render('books/index', { books: books })
  }).catch(err => {
    console.log(`Error: ${err}`)
    // res.send(500)
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
    res.render('books/index', { filtered: books, title: 'Overdue' })
  }).catch(err => {
    console.log(`Error: ${err}`)
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
    res.render('books/index', { filtered: books, title: 'Checked Out' })
  }).catch(err => {
    console.log(`Error: ${err}`)
  })
})

/* add books page. */
router.get('/new', function (req, res, next) {
  res.render('books/new_book', {
    book: models.Books.build(),
    title: 'New Book',
    btn: 'Create New Book'
  })
})

/* POST create book. */
router.post('/new', function (req, res, next) {
  models.Books.create(req.body).then(book => {
    res.redirect('/books/' + book.id)
  }).catch((err) => {
    debugger
    // if (err.name === 'SequelizeValidationError') {
    //   res.render('books/new_book', {
    //     article: models.Books.build(req.body),
    //     title: 'New Article',
    //     errors: err.errors
    //   })
    // } else {
    //   throw err
    // }
  }).catch(err => {
    console.log(`Error: ${err}`)
  })
})

/* GET individual book. */
router.get('/:id', function (req, res, next) {
  models.Books.findById(req.params.id).then((book) => {
    if (book) {
      res.render('books/book', {
        book: book,
        title: book.title,
        btn: 'Update'
      })
    } else {
      res.send(404)
    }
  }).catch(err => {
    console.log(`Error: ${err}`)
  })
})

/* PUT update article. */
router.put('/:id', function (req, res, next) {
  // debugger
  models.Books.findById(req.params.id).then((book) => {
    if (book) {
      return book.update(req.body)
    } else {
      res.send(404)
    }
  }).then((book) => {
    res.redirect('/books/' + book.id)
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
    console.log(`Error: ${err}`)
  })
})

module.exports = router
