
module.exports = function () {
  this.parseDate = (arr, path) => {
    // check if route is books path, change array to book loans
    if (!path) {
      arr = arr[0].Loans
    }
    return arr.map((item) => {
      // check if item has been returned
      if (item.dataValues.returned_on) {
        item.dataValues.returned_on = item.returned_on.slice(0, 10)
      }
      item.dataValues.loaned_on = item.loaned_on.slice(0, 10)
      item.dataValues.return_by = item.return_by.slice(0, 10)
    })
  }
  this.errorHandler = (err, res) => {
    // check if route is books path, change array to book loans
    if (err) {
      console.log('errorhandler: ' + err)
    } else {
      res.send(404)
    }
  }
  this.validationErr = (err) => {
    return {
      message: 'Ooops!',
      errors: err.errors
    }
  }
}
