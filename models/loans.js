'use strict';
// import
module.exports = function (sequelize, DataTypes) {
  var Loans = sequelize.define('Loans', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    book_id: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: 'Book is required'
        }
      }
    },
    patron_id: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: 'Patron is required'
        }
      }
    },
    loaned_on: {
      type: DataTypes.DATE,
      validate: {
        notEmpty: {
          msg: 'Loaned On is required'
        }
      }
    },
    return_by: {
      type: DataTypes.DATE,
      validate: {
        notEmpty: {
          msg: 'Return By is required'
        }
      }
    },
    returned_on: {
      type: DataTypes.DATE,
      allowNull: true,
      validate: {
        notEmpty: {
          msg: 'Returned On is required'
        }
      }
    }
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