var express = require('express')
var router = express.Router()
const books = require('../models/').Books

/* GET all books page. */
router.get('/', function (req, res, next) {
  books.findAll({
	  order: [['title', 'ASC']]
	})
    .then(books => {
    res.render('all_books', { books: books, title: 'Books' })
  }).catch(err => {
    res.send(500)
  })
})

module.exports = router
