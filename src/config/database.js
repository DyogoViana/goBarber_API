module.exports = {
    dialect: 'postgres',
    host: 'localhost',
    username: 'postgres',
    password: 'freedom',
    database: 'goBarber-DB',

    define: {
        timestamps: true,
        underscored: true,
        underscoredAll: true,
    },
};
