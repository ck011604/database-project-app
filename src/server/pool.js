const mysql = require('mysql2');
// Create a connection pool
const pool = mysql.createPool({
    host: 'localhost',   //  database host
    user: 'root', //  MySQL username
<<<<<<< HEAD
    password: 'yuca69!', //  MySQL password
    database: 'restaurantDB', // database name
=======
    password: 'P@sswordDB123', //  MySQL password
    database: 'restaurantdb', // database name
>>>>>>> ee48a8d0d48142bb16c86c599a48db8699f88501
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});
module.exports = pool;
