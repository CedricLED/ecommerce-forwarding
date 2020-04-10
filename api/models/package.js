'use strict';
module.exports = (sequelize, DataTypes) => {
  const Package = sequelize.define('Package', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    orderId: DataTypes.UUID,
    category: {
      type: DataTypes.ENUM,
      values: ['shoes', 'clothes', 'misc'],
    },
    amount: DataTypes.INTEGER,
    trackingNumber: DataTypes.STRING,
  }, {});
  Package.associate = function(models) {
    Package.belongsTo(models.Order, {foreignKey: 'orderId', as: 'Order'});
  };
  return Package;
};
