const Sequelize = require('sequelize');

module.exports = {
        // test: { // user id
        //     type: Sequelize.STRING,
        //     unique: true,
        // },
        // id: { // user id
        //     type: Sequelize.STRING,
        //     unique: true,
        // },
        // b1_count: { 
        //     type: Sequelize.INTEGER,
        //     defaultValue: 0,
        //     allowNull: false,
        // },
        // usage_count: {
        //     type: Sequelize.INTEGER,
        //     defaultValue: 0,
        //     allowNull: false,
        // },
            name: {
                type: Sequelize.STRING,
                unique: true,
            },
            description: Sequelize.TEXT,
            username: Sequelize.STRING,
            usage_count: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
                allowNull: false,
            },
}