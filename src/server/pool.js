const mysql = require('mysql2');
// Create a connection pool
const pool = mysql.createPool({
    host: 'localhost',   //  database host
    user: 'root', //  MySQL username
    password: 'P@sswordDB123', //  MySQL password
    database: 'restaurantDB' // database name
});
module.exports = pool;