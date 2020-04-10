'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('IDCards', {
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
        onDelete: 'CASCADE',
      },
      idName: {
        type: Sequelize.STRING,
      },
      idNumber: {
        type: Sequelize.STRING,
      },
      idFront: {
        type: Sequelize.STRING,
      },
      idRear: {
        type: Sequelize.STRING,
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
    return queryInterface.dropTable('IDCards');
  },
};
