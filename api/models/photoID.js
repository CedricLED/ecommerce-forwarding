'use strict';
module.exports = (sequelize, DataTypes) => {
  const IDCard = sequelize.define('IDCard', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    customerId: DataTypes.INTEGER,
    idName: DataTypes.STRING,
    idNumber: DataTypes.STRING,
    idFront: DataTypes.STRING,
    idRear: DataTypes.STRING,
  }, {});
  IDCard.associate = function(models) {
    IDCard.belongsTo(models.Customer, {foreignKey: 'customerId', as: 'Customer'});
    IDCard.hasMany(models.Order, {as: 'Orders'});
  };
  return IDCard;
};
