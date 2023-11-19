const { Pool } = require('pg');
const postgresPool = new Pool({
    host: 'localhost',
    database: process.env.POSTGRES_DB,

    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASSWORD,
    port: 5432
});

postgresPool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
});

module.exports = postgresPool;