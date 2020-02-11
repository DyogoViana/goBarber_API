module.exports = {
    // Add altering commands here. Return a promise to correctly handle asynchronicity.
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable('users', {
            id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            email: {
                type: Sequelize.STRING,
                allowNull: false,
                unique: true,
            },
            password_hash: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            provider: {
                type: Sequelize.BOOLEAN,
                defaultvalue: false,
                allowNull: false,
            },
            created_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
            update_at: {
                type: Sequelize.DATE,
                allowNull: false,
            },
        });
    },

    // Add reverting commands here. Return a promise to correctly handle asynchronicity.
    down: queryInterface => {
        return queryInterface.dropTable('users');
    },
};
