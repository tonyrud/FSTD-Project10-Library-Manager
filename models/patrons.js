'use strict';
module.exports = function(sequelize, DataTypes) {
  var Patrons = sequelize.define('Patrons', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    first_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'First Name is required'
        }
      }
    },
    last_name: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Last Name is required'
        }
      }
    },
    address: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Address is required'
        }
      }
    },
    email: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Email is required'
        }
      }
    },
    library_id: {
      type: DataTypes.STRING,
      validate: {
        notEmpty: {
          msg: 'Library ID is required'
        }
      }
    },
    zip_code: {
      type: DataTypes.INTEGER,
      validate: {
        notEmpty: {
          msg: 'Zipcode is required'
        },
        isNumeric: {
          msg: 'Zipcode must be numbers'
        }
      }
    }
  }, {
    classMethods: {
      associate: function (models) {
        Patrons.hasMany(models.Loans, {foreignKey: 'patron_id'})
      }
    }
  });
  return Patrons;
};