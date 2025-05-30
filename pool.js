const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "data_car",
  password: "1234",
  port: 5432,
});

module.exports = pool;