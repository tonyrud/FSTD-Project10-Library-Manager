'use strict';
// import
module.exports = function (sequelize, DataTypes) {
  var Loans = sequelize.define('Loans', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    book_id: DataTypes.INTEGER,
    patron_id: DataTypes.INTEGER,
    loaned_on: DataTypes.DATE,
    return_by: DataTypes.DATE,
    returned_on: DataTypes.DATE
  }, {
    classMethods: {
      associate: function (models) {
        Loans.belongsTo(models.Patrons, {foreignKey: 'patron_id'})
        Loans.belongsTo(models.Books, {foreignKey: 'book_id'})
      }
    }
  });
  return Loans;
};