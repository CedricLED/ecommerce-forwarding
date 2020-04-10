'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Orders', {
      id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
      },
      customerId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { // Order belongsTo Customer 1:1
          model: 'Customers',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      idCardId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { // Order belongsTo IDCard 1:1
          model: 'IDCards',
          key: 'id',
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      code: {
        type: Sequelize.STRING,
      },
      plan: {
        type: Sequelize.ENUM,
        values: ['A', 'B', 'C'],
      },
      recName: {
        type: Sequelize.STRING,
      },
      recPhone: {
        type: Sequelize.STRING,
      },
      recAddr: {
        type: Sequelize.STRING,
      },
      recCity: {
        type: Sequelize.STRING,
      },
      recState: {
        type: Sequelize.ENUM,
        values: ['CN-AH', 'CN-BJ', 'CN-CQ', 'CN-FJ', 'CN-GD', 'CN-GS', 'CN-GX', 'CN-GZ', 'CN-HA', 'CN-HB', 'CN-HE', 'CN-HI', 'CN-HK', 'CN-HL', 'CN-HN', 'CN-JL', 'CN-JS', 'CN-JX', 'CN-LN', 'CN-MO', 'CN-NM', 'CN-NX', 'CN-QH', 'CN-SC', 'CN-SD', 'CN-SH', 'CN-SN', 'CN-SX', 'CN-TJ', 'CN-TW', 'CN-XJ', 'CN-XZ', 'CN-YN', 'CN-ZJ'],
      },
      status: {
        type: Sequelize.ENUM,
        values: ['Created', 'Recieved', 'Processing', 'Finished'],
      },
      paid: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Orders');
  },
};
