'use strict';
module.exports = function(sequelize, DataTypes) {
  var Patrons = sequelize.define('Patrons', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    address: DataTypes.STRING,
    email: DataTypes.STRING,
    library_id: DataTypes.STRING,
    zip_code: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        Patrons.hasMany(models.Loans, {foreignKey: 'patron_id'})
        // Patrons.belongsTo(models.Book, {foreignKey: 'book_id'})
      }
    }
  });
  return Patrons;
};