'use strict';

function makeid(length) {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNPQRSTUVWXYZ';
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
module.exports = (sequelize, DataTypes) => {
  const Customer = sequelize.define('Customer', {
    username: DataTypes.STRING,
    banned: DataTypes.BOOLEAN,
    email: DataTypes.STRING,
    discordID: DataTypes.STRING,
    descrim: DataTypes.STRING,
    code: {
      type: DataTypes.STRING,
      defaultValue: makeid(3),
    },
  }, {});
  Customer.associate = function(models) {
    Customer.hasMany(models.Order, {
      as: 'Orders',
    });
    Customer.hasMany(models.IDCard, {
      as: 'IDCards',
      onDelete: 'CASCADE',
    });
  };
  return Customer;
};
