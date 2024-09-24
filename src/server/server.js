const http = require('http');
const mysql = require('mysql2');
const url = require('url');
// const querystring = require('querystring');

// Create a connection pool
const pool = mysql.createPool({
    host: 'localhost',   //  database host
    user: 'root', //  MySQL username
    password: 'P@sswordDB123', //  MySQL password
    database: 'restaurantDB' // database name
});

const server = http.createServer((req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    console.log("Creating Server");
    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }
    if (req.method === "POST") {
        if (req.url === "/login") {
            console.log("Received Post and /login");
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                const { email, password } = JSON.parse(body);

                pool.query('SELECT * FROM logins WHERE email = ? AND password = ?', [email, password],
                    (error, results) => {
                        if (error) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ success: false, message: 'Server Error fetching logins' }));
                            console.log('Server Error', error);
                            return;
                        }
                        if (results.length > 0) {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ success: true }));
                            console.log('Correct Login');
                        }
                        else {
                            res.writeHead(401, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ success: false, message: 'Invalid credentials' }));
                            console.log("Invalid credentials");
                        }
                    }
                );
            });
        }
        if (req.url === "/create-account") {
            console.log("Received request to create account");
            let body = '';
            req.on('data', chunk => {
                body += chunk.toString();
            });
            req.on('end', () => {
                const { email, firstName, lastName, password } = JSON.parse(body);
                pool.query('INSERT INTO logins (email, firstName, lastName, password) VALUES (?, ?, ?, ?)',
                    [email, firstName, lastName, password],
                    (error, result) => {
                        if (error) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ success: false, message: 'Server Error inserting into logins' }));
                            return;
                        } // Else
                        res.writeHead(200, { 'Content-Type': 'application/json' });
                        res.end(JSON.stringify({ success: true }));
                        console.log("Successfully created account");
                    }
                )
            });
        }
        if (req.url === "/confirm-order") {
          console.log("Received request to add order");
          let body = "";
          req.on("data", (chunk) => {
            body += chunk.toString();
          });
          req.on("end", () => {
            const { selectedItems, waiterID, tableNumber, customerID, subtotal, tax, tipPercent, tipAmount, total, receivedAmount, changeAmount } = JSON.parse(body);
            pool.query(
              "INSERT INTO orders (waiter_id, table_id, customer_id, subtotal, tip_percent, tip_amount, total, received_amount, change_amount, tax_amount) VALUES (?,?,?,?,?,?,?,?,?,?)",
              [waiterID, tableNumber, customerID, subtotal, tipPercent, tipAmount, total, receivedAmount, changeAmount, tax],
              (error, result) => {
                if (error) {
                  res.writeHead(500, { "Content-Type": "application/json" });
                  res.end(
                    JSON.stringify({
                      success: false,
                      message: "Server Error inserting into orders",
                    })
                  );
                  console.log(error)
                  return;
                } // Else
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: true }));
                console.log("Successfully added order");
              }
            );
          });
        }
    }
    if(req.method === "GET") {
        if (req.url === "/menu") {
            console.log("Received request to get menu")
            pool.query('SELECT * FROM menu ORDER BY price DESC', (error, results) => {
                if (error) {
                    res.writeHead(500, { 'Content-Type': 'application/json'});
                    res.end(JSON.stringify({ success: false, message: 'Server Error fetching menu'}))
                    console.log("Error fetching menu")
                    return;
                } // Else
                console.log("Successfully fetched menu")
                res.writeHead(200, { "Content-Type": "application/json" });
                res.end(JSON.stringify({ success: true, menu: results}));
            })
        }
        if (req.url === "/inventory-stock") {
          console.log("Received request to get inventory stock");
          pool.query("SELECT ingredient_id, amount FROM inventory", (error, results) => {
              if (error) {
                res.writeHead(500, { "Content-Type": "application/json" });
                res.end(
                  JSON.stringify({
                    success: false,
                    message: "Server Error fetching inventory",
                  })
                );
                console.log("Error fetching inventory");
                return;
              } // Else
              console.log("Successfully fetched inventory");
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ success: true, inventory: results }));
            }
          );
        }
    }
})

server.listen(3001, () => {
    console.log('Server running on port 3001')
});

// Remember to end the pool when your application terminates
process.on('SIGINT', () => {
    pool.end(err => {
        if (err) {
            console.error('An error occurred while closing the database connection pool:', err);
        } else {
            console.log('Database connection pool closed.');
        }
        process.exit(err ? 1 : 0);
    });
});
