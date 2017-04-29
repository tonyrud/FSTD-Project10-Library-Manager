'use strict';
module.exports = function(sequelize, DataTypes) {
  var Books = sequelize.define('Books', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    title: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Title is required'
        }
      }
    },
    author: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Author is required'
        }
      }
    },
    genre: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Genre is required'
        }
      }
    },
    first_published: {
      type: DataTypes.INTEGER,
      allowNull: true,
      validate: {
        isNumeric: {
          msg: 'First Published must be a number'
        }
      }
    }
  }, {
    classMethods: {
      associate: function (models) {
        Books.hasMany(models.Loans, {foreignKey: 'book_id'})
      }
    }
  })
  return Books
}