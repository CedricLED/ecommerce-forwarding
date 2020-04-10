'use strict';
module.exports = (sequelize, DataTypes) => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    customerId: DataTypes.INTEGER,
    idCardId: DataTypes.UUID,
    code: DataTypes.STRING,
    plan: {
      type: DataTypes.ENUM,
      values: ['A', 'B', 'C'],
    },
    recName: DataTypes.STRING,
    recPhone: DataTypes.STRING,
    recAddr: DataTypes.STRING,
    recCity: DataTypes.STRING,
    recState: {
      type: DataTypes.ENUM,
      values: ['CN-AH', 'CN-BJ', 'CN-CQ', 'CN-FJ', 'CN-GD', 'CN-GS', 'CN-GX', 'CN-GZ', 'CN-HA', 'CN-HB', 'CN-HE', 'CN-HI', 'CN-HK', 'CN-HL', 'CN-HN', 'CN-JL', 'CN-JS', 'CN-JX', 'CN-LN', 'CN-MO', 'CN-NM', 'CN-NX', 'CN-QH', 'CN-SC', 'CN-SD', 'CN-SH', 'CN-SN', 'CN-SX', 'CN-TJ', 'CN-TW', 'CN-XJ', 'CN-XZ', 'CN-YN', 'CN-ZJ'],
    },
    status: {
      type: DataTypes.ENUM,
      values: ['Created', 'Recieved', 'Processing', 'Finished'],
    },
    paid: DataTypes.BOOLEAN,
  }, {});
  Order.associate = function(models) {
    Order.belongsTo(models.Customer, {foreignKey: 'customerId', as: 'Customer'});
    Order.belongsTo(models.IDCard, {foreignKey: 'idCardId', as: 'IDCard'});
    Order.hasMany(models.Package, {as: 'Packages', onDelete: 'CASCADE'});
  };
  return Order;
};
