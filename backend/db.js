// db.js
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "192.168.139.35",
  database: "san-jorge",
  password: "123",
  port: 5432,
});

module.exports = pool;
