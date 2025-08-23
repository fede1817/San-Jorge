// db.js
const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "192.168.100.87",
  database: "sanjorge",
  password: "123",
  port: 5432,
});

module.exports = pool;
