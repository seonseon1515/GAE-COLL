module.exports = {
    development: {
        username: process.env.DEVEL_DB_ID,
        password: process.env.DEVEL_DB_PW,
        database: process.env.DEVEL_DB_DATABASE,
        host: process.env.DEVEL_DB_HOST,
        dialect: process.env.DEVEL_DIALECT,
    },
    test: {
        username: 'root',
        password: null,
        database: 'database_test',
        host: '127.0.0.1',
        dialect: 'mysql',
    },
    production: {
        username: 'root',
        password: null,
        database: 'database_production',
        host: '127.0.0.1',
        dialect: 'mysql',
    },
};
