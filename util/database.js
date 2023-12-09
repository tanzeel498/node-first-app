const mysql = require("mysql2");

const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  database: "node-complete",
  password: "hjI$5_()_pak%123",
});

module.exports = pool.promise();
